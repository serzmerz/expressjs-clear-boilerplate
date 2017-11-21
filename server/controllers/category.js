const express = require('express');
const db = require('../models');
const CategoryModel = db.Categories;

const categoryRouter = new express.Router();

categoryRouter
    .get('/', function(req, res) {
        CategoryModel.findAll({ attributes: [ 'id', [ 'name', 'value' ] ] }).then(data => {
            res.json({ response: {
                success: true,
                data } });
        }).catch(err => {
            res.json({ response: {
                success: false,
                errors: err } });
        });
    });

module.exports = categoryRouter;
