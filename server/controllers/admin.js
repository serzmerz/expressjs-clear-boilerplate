const express = require('express');
const expressJwt = require('express-jwt');
const CONSTANTS = require('../constants');
const SECRET = CONSTANTS.SECRET;
const authenticate = expressJwt({ secret: SECRET });
const serialize = require('../middlewares/auth/serializeUser');
const generateAccessToken = require('../middlewares/auth/generateAccessToken');
const respond = require('../middlewares/auth/respondAuth');

const adminRouter = new express.Router();
const passport = require('../auth');

adminRouter
    .post('/', passport.initialize(), function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (! user) return res.status(401).json({ message: info });
            req.user = user;
            next();
        })(req, res, next);
    }, serialize, generateAccessToken, respond)
    .get('/me', authenticate, function(req, res) {
        res.status(200).json(req.user);
    });

module.exports = adminRouter;
