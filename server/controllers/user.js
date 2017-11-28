const express = require('express');
const db = require('../models');
const expressJwt = require('express-jwt');
const CONSTANTS = require('../constants');
const SECRET = CONSTANTS.SECRET;
const authenticate = expressJwt({ secret: SECRET });
const AuthenticationClient = require('auth0'). AuthenticationClient;
const ManagementClient = require('auth0').ManagementClient;
const UserModel = db.Users;

UserModel.belongsTo(db.Categories, { foreignKey: 'categoryId', as: 'category' });
UserModel.belongsTo(db.DailyStats, { foreignKey: 'id', targetKey: 'userId' });
UserModel.belongsTo(db.WeeklyStats, { foreignKey: 'id', targetKey: 'userId' });
UserModel.belongsTo(db.MonthlyStats, { foreignKey: 'id', targetKey: 'userId' });
UserModel.belongsTo(db.HourlyStats, { foreignKey: 'id', targetKey: 'userId' });

const userRouter = new express.Router();

const auth0 = new AuthenticationClient({
    domain: CONSTANTS.DOMAIN,
    clientId: CONSTANTS.CLIENT_ID
});

const management = new ManagementClient({
    domain: CONSTANTS.DOMAIN,
    clientId: CONSTANTS.API_CLIENT_ID,
    clientSecret: CONSTANTS.API_CLIENT_SECRET,
    audience: CONSTANTS.API_CLIENT_AUDIENCE,
    tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: 10
    }
});

const mockData = {
    highlight: {
        rate: {
            number: '10',
            to: 0,
            date: '10/22/17'
        },
        followers: {
            number: '17K',
            to: 'up',
            date: '10/12/17'
        },
        likes: {
            number: '20K',
            to: 'down',
            date: '10/22/27'
        },
        posts: {
            number: '50',
            to: 0,
            date: '07/22/17'
        }
    }
};

const getUserById = id => UserModel.findById(id,
    { include: [
        {
            model: db.Categories,
            as: 'category',
            attributes: [ 'id', [ 'name', 'value' ] ]
        },
        {
            model: db.HourlyStats,
            attributes: { exclude: [ 'avgLikes', 'avgComments', 'createdAt', 'updatedAt' ] }
        },
        {
            model: db.DailyStats,
            attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        },
        {
            model: db.WeeklyStats,
            attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        },
        {
            model: db.MonthlyStats,
            attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        }
    ], attributes: { exclude:
        [ 'categoryId', 'instagramToken', 'accessTokenAuth0', 'createdAt', 'updatedAt', 'calculatedRating', 'calculatedRatingPrev' ]
    } });

userRouter
    .get('/category/:category/offset/:offset/limit/:limit', function(req, res) {
        UserModel.findAndCountAll({
            where: { categoryId: req.params.category },
            attributes: {
                exclude: [ 'instagramToken', 'accessTokenAuth0', 'calculatedRating', 'calculatedRatingPrev', 'createdAt', 'updatedAt' ]
            },
            include: [
                {
                    model: db.Categories,
                    as: 'category',
                    attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
                },
                {
                    model: db.HourlyStats,
                    attributes: { exclude: [ 'avgLikes', 'avgComments', 'createdAt', 'updatedAt' ] },
                    required: true
                },
                {
                    model: db.DailyStats,
                    attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
                },
                {
                    model: db.WeeklyStats,
                    attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
                },
                {
                    model: db.MonthlyStats,
                    attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
                }
            ],
            order: [ [ db.HourlyStats, 'calculatedRating', 'ASC' ] ],
            offset: req.params.offset, limit: req.params.limit
        }).then(data => {
            res.json({
                success: true,
                result: data
            });
        }).catch(err => {
            res.json({
                success: false,
                errors: err.toString()
            });
        });
    })
    .get('/all', function(req, res) {
        UserModel.findAll({
            where: { registerEnded: true },
            attributes: [ 'id', [ 'nickname', 'name' ], 'pending', 'banned' ]
        }).then(data => {
            res.json({
                success: true,
                data });
        }).catch(err => {
            res.json({
                success: false,
                errors: err.toString() });
        });
    })
    .get('/one/:id', function(req, res) {
        getUserById(req.params.id).then(result => {
            res.json({
                success: true,
                result
            });
        }).catch(err => {
            res.json({
                success: false,
                errors: err.toString() });
        });
    })
    .get('/authorize', function(req, res) {
        const accessToken = req.get('accessToken');

        auth0.getProfile(accessToken).then(user => {
            UserModel.findOrCreate({ where: { instagramId: user.sub },
                defaults: {
                    instagramId: user.sub,
                    nickname: user.nickname,
                    picture: user.picture,
                    accessTokenAuth0: accessToken,
                    pending: 'accepted'
                },
                attributes: [ 'id', 'instagramId', 'nickname', 'picture', 'pending', 'registerEnded' ]
            }).then(result => res.json({
                success: true,
                result: result[0] }));
        }).catch(error => {
            res.json({ response: error });
        });
    })
    .post('/updateProfile', function(req, res) {
        const body = req.body;

        if (! body.country) body.country = {};
        UserModel.findOne({ where: { accessTokenAuth0: req.get('accessToken') } }).then(user => {
            if (user) {
                management.getUser({ id: user.instagramId }).then(userProfile => {
                    user.update({
                        picture: userProfile.picture,
                        nickname: userProfile.nickname,
                        instagramToken: userProfile.identities[0].access_token,
                        categoryId: body.category.id,
                        country: body.country.id,
                        registerEnded: true
                    },
                { returning: true })
                    .then(() =>
                        getUserById(user.id).then(data => res.json({
                            success: true,
                            result: { ...JSON.parse(JSON.stringify(data)), ...mockData }
                        })).catch(error => res.json({
                            success: false,
                            error: error.toString()
                        })))
                    .catch(error => res.json({ response: {
                        success: false,
                        error: error.toString()
                    } })
            );
                }).catch(error => res.json({ response: {
                    success: false,
                    error
                } }))
        .catch(error => res.json(error));
            } else res.json({ success: false, error: 'User Not found' });
        });
    })
    .post('/suggestNewEntry', function(req, res) {
        const body = req.body;

        UserModel.create({ nickname: body.accountId, categoryId: body.categoryId, pending: 'proposed' })
            .then(() => res.json({ success: true }));
    })
    .put('/suggestNewEntry/:id', authenticate, function(req, res) {
        const body = req.body;

        UserModel.update(body, { where: { id: req.params.id } })
            .then(() => res.json({ success: true }));
    })
    .delete('/:id', authenticate, function(req, res) {
        UserModel.destroy({ where: { id: req.params.id } }).then(data => {
            res.json({
                success: Boolean(data),
                data
            });
        }).catch(err => {
            res.json({
                success: false,
                error: err
            });
        });
    });

module.exports = userRouter;
