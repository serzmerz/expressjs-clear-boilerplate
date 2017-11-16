const express = require('express');
const user = require('./user');
const category = require('./category');

const router = new express.Router();

router.use('/user', user);
router.use('/category', category);
router.get('/status', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = router;
