const express = require('express');
const db = require('../models');
const CategoryModel = db.Category;

const categoryRouter = new express.Router();

categoryRouter
    .get('/', function(req, res) {
        CategoryModel.findAll().then(data => {
            res.json({ response: {
                success: true,
                data: data } });
        }).catch(err => {
            res.json({ response: {
                success: false,
                errors: err } });
        });
    });

module.exports = categoryRouter;
