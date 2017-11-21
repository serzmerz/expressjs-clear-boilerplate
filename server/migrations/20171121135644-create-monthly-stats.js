'use strict';
module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('MonthlyStats', {
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
            totalFollowers: {
                type: Sequelize.INTEGER
            },
            totalLikes: {
                type: Sequelize.INTEGER
            },
            totalPosts: {
                type: Sequelize.INTEGER
            },
            lastTotalFollowers: {
                type: Sequelize.INTEGER
            },
            lastTotalLikes: {
                type: Sequelize.INTEGER
            },
            lastTotalPosts: {
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
        return queryInterface.dropTable('MonthlyStats');
    }
};
