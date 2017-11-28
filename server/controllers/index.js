const express = require('express');
const user = require('./user');
const category = require('./category');
const admin = require('./admin');
const stats = require('./stats');
const ratingSettings = require('./rating-settings');
const reports = require('./reports');

const router = new express.Router();

router.get('/', (req, res) => {
    res.send('Hello, Test!');
});
router.use('/user', user);
router.use('/category', category);
router.use('/admin', admin);
router.use('/stats', stats);
router.use('/rating-settings', ratingSettings);
router.use('/reports', reports);
router.get('/status', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = router;
