const path = require('path');
const configs = require('./lib/mapper-configs');

module.exports = configs(
    path.resolve(__dirname, '../configs'),
    'default/node',
    'current/node'
);

