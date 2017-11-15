const Seq = require('sequelize');
const config = require('../config');

module.exports = new Seq(config.get('database.url'));
