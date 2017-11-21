const express = require('express');
const db = require('../models');
const CategoryModel = db.Category;
const expressJwt = require('express-jwt');
const CONSTANTS = require('../constants');
const SECRET = CONSTANTS.SECRET;
const authenticate = expressJwt({ secret: SECRET });

const categoryRouter = new express.Router();

categoryRouter
    .get('/', function(req, res) {
        CategoryModel.findAll().then(data => {
            res.json({
                success: true,
                data });
        }).catch(err => {
            res.json({
                success: false,
                errors: err });
        });
    })
    .delete('/:id', authenticate, function(req, res) {
        CategoryModel.destroy({ where: { id: req.params.id } }).then(data => {
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
    })
    .put('/:id', authenticate, function(req, res) {
        const body = req.body;

        CategoryModel.update({ pending: body.pending }, { where: { id: req.params.id } })
            .then(data => {
                res.json({ success: Boolean(data) });
            })
            .catch(error => {
                res.json({ success: false, error });
            });
    })
    .post('/', function(req, res) {
        const body = req.body;

        CategoryModel.findOrCreate({ where: { name: body.name }, defaults: { pending: 'proposed' } })
            .then(newCategory => {
                res.json({
                    success: true,
                    newCategory
                });
            })
            .catch(error => {
                res.json({
                    success: false,
                    error
                });
            });
    });

module.exports = categoryRouter;
