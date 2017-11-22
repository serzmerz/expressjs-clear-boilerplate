const express = require('express');
const db = require('../models');
const ReportsModel = db.Reports;

const ReportsRouter = new express.Router();

ReportsModel.belongsTo(db.Users, { foreignKey: 'userId', as: 'user' });

ReportsRouter
    .get('/', function(req, res) {
        ReportsModel.findAll({
            include: [ {
                model: db.Users,
                as: 'user',
                attributes: [ [ 'nickname', 'name' ] ]
            } ]
        }).then(data => {
            res.json({
                success: true,
                data });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
    })
    .post('/', function(req, res) {
        const body = req.body;

        ReportsModel.findOrCreate({
            where: {
                userId: body.userId,
                reason: body.reason
            },
            defaults: {
                userId: body.userId,
                reason: body.reason
            }
        })
            .then(newReport => {
                res.json({
                    success: true,
                    newReport
                });
            })
            .catch(error => {
                res.json({
                    success: false,
                    error
                });
            });
    })
    .delete('/:id', function(req, res) {
        ReportsModel.destroy({ where: { id: req.params.id } })
            .then(data => {
                res.json({ success: Boolean(data) });
            })
            .catch(error => {
                res.json({ success:false, error });
            });
    });

module.exports = ReportsRouter;
