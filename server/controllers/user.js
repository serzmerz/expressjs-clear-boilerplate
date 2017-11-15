const express = require('express');
const crypto = require('crypto');
const db = require('../models')
const UserModel = db.User;

const userRouter = new express.Router();

userRouter
    .get('/', function(req, res) {
        UserModel.findAll().then(data => {
            res.json({ response: {
                success: true,
                users: data } });
        }).catch(err => {
            res.json({ response: {
                success: false,
                errors: err } });
        });
    })
    .get('/one/:id', function(req, res) {
        UserModel.findById(req.params.id).then(data => {
            res.json({ response: { users: data } });
        })
        .catch(err => {
            res.json({ response: err });
        });
    })
    .post('/', function(req, res) {
        const server = req.body;

        /* to middleware*/
        server.password = crypto.createHmac('sha256', server.password)
            .update('hack this please')
            .digest('hex');
        /* end*/
        UserModel.create(server).then(data => {
            res.json({ response: { success: true,
                body: data } });
        })
            .catch(err => {
                res.json({ response: {
                    success: false,
                    errors: err
                } });
            });
    })
    .put('/', function(req, res) {
        const server = req.body;

        server.data.updated_at = Date.now();

        UserModel.update(server.data, { where: { id: server.id }, returning: true })
            .then(data => {
                res.json({
                    response: {
                        success: Boolean(Number(data[0])),
                        body: data[1].length === 0 ? 'No one row updated!' : data[1]
                    }
                });
            })
            .catch(err => {
                res.json({
                    response: {
                        success: false,
                        errors: err
                    }
                });
            });
    })
    .delete('/:id', function(req, res) {
        UserModel.destroy({ where: { id: req.params.id } })
        .then(data => {
            res.json({ response: { success: Boolean(Number(data)) } });
        })
            .catch(err => {
                res.json({ response: err });
            });
    })
;

module.exports = userRouter;
