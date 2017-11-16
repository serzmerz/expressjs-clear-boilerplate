'use strict';
module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            instagramId: {
                allowNull: false,
                type: Sequelize.STRING
            },
            nickname: {
                allowNull: false,
                type: Sequelize.STRING
            },
            instagramToken: {
                type: Sequelize.STRING
            },
            picture: {
                allowNull: false,
                type: Sequelize.STRING
            },
            accessTokenAuth0: {
                allowNull: false,
                type: Sequelize.STRING
            },
            registerEnded: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            pending: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            categoryId: {
                type: Sequelize.INTEGER
            },
            country: {
                type: Sequelize.STRING
            },
            calculatedRating: {
                type: Sequelize.INTEGER
            },
            calculatedRatingPrev: {
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
        return queryInterface.dropTable('Users');
    }
};
