const express = require('express');
const expressJwt = require('express-jwt');
const CONSTANTS = require('../constants');
const db = require('../models');
const RatingSettingsModel = db.RatingSettings;
const SECRET = CONSTANTS.SECRET;
const authenticate = expressJwt({ secret: SECRET });

const ratingSettingsRouter = new express.Router();

ratingSettingsRouter
    .get('/', authenticate, function(req, res) {
        RatingSettingsModel.findAll()
            .then(data => {
                res.json({ success: true, data });
            });
    })
    .put('/', authenticate, function(req, res) {
        const body = req.body;

        RatingSettingsModel.update(body.settings)
            .then(data => {
                res.json({ success: Boolean(data) });
            })
            .catch(error => {
                res.json({ success: false, error });
            });
    });

module.exports = ratingSettingsRouter;
