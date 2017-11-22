'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Reports', [
            {
                userId: 2,
                reason: 'Inappropriate',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 3,
                reason: 'Inappropriate',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 4,
                reason: 'Spam',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 5,
                reason: 'Inappropriate',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down(queryInterface, Sequelize) {
    }
};
