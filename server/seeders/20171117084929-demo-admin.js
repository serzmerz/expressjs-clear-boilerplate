'use strict';

const crypto = require('crypto');

const createHash = function(password) {
    return crypto.createHmac('sha256', password)
        .update('hack this please')
        .digest('hex');
};

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Admins', [ {
            login: 'admin@admin.com',
            password: createHash('admin'),
            createdAt: new Date(),
            updatedAt: new Date()
        } ], {});
    },

    down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Admins', null, {});
    }
};
