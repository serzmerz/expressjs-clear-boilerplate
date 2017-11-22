'use strict';
module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('Reports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            reason: {
                type: Sequelize.ENUM,
                values: [ 'Spam', 'Inappropriate' ]
            },
            count: {
                defaultValue: 1,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down(queryInterface, Sequelize) {
        return queryInterface.dropTable('Reports');
    }
};
