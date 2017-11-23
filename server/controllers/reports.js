'use strict';
const express = require('express');
const db = require('../models');
const nodemailer = require('nodemailer');

require('dotenv').config();
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
                if (! newReport[1]) {
                    newReport[0].update({ count: newReport[0].count + 1 }).then(() => {
                        res.json({
                            success: true,
                            data: newReport[0]
                        });
                    }).catch(() => res.json({ success: false }));
                } else {
                    res.json({
                        success: true,
                        data: newReport[0]
                    });
                }
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
                res.json({ success: false, error });
            });
    })
    .post('/sendFeedback', function(req, res) {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_PASSWORD
            }
        });

        const mailOptions = {
            from: 'ivan1234@gmail.com',
            to: 'serzmerz@gmail.com',
            subject: 'Feedback to hypeboard',
            text: req.body.message
        };

        transporter.sendMail(mailOptions).then(info => {
            console.log('Message sent: %s', info.messageId);
        }).catch(error => console.log(error));
        res.sendStatus(200);
    });

module.exports = ReportsRouter;
