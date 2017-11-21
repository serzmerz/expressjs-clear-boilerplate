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
                type: Sequelize.STRING
            },
            accessTokenAuth0: {
                type: Sequelize.STRING
            },
            registerEnded: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            pending: {
                allowNull: false,
                defaultValue: 'base',
                type: Sequelize.ENUM,
                values: [ 'accepted', 'declined', 'proposed', 'base' ]
            },
            banned: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'id'
                }
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
