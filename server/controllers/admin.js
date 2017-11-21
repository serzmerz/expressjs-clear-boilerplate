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
    .post('/', passport.initialize(), passport.authenticate(
        'local', {
            session: false
        }), serialize, generateAccessToken, respond)
    .get('/me', authenticate, function(req, res) {
        res.status(200).json(req.user);
    });

module.exports = adminRouter;
