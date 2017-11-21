const express = require('express');
const user = require('./user');
const category = require('./category');
const admin = require('./admin');
const stats = require('./stats');

const router = new express.Router();

router.use('/user', user);
router.use('/category', category);
router.use('/admin', admin);
router.use('/stats', stats);
router.get('/status', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = router;
