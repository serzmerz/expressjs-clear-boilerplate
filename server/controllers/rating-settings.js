const express = require('express');
const expressJwt = require('express-jwt');
const CONSTANTS = require('../constants');
const db = require('../models');
const RatingSettingsModel = db.RatingSetting;
const SECRET = CONSTANTS.SECRET;
const authenticate = expressJwt({ secret: SECRET });

const ratingSettingsRouter = new express.Router();

ratingSettingsRouter
    .get('/', authenticate, function(req, res) {
        RatingSettingsModel.findAll()
            .then(data => {
                res.json({ success: true, data });
            })
            .catch(error => {
                res.json({ success: false, error });
            });
    })
    .put('/', authenticate, function(req, res) {
        const body = req.body;

        body.settings.forEach(setting => {
            RatingSettingsModel.update({ value: setting.value }, { where: { id: setting.id } })
                .catch(() => {
                    res.json({ success: false });
                });
        });

        res.json({ success: true });
    });

module.exports = ratingSettingsRouter;
