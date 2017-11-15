const express = require('express');
const user = require('./user');

const router = new express.Router();

router.use('/user', user);
router.get('/status', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = router;
