'use strict';
module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('Categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            pending: {
                allowNull: false,
                defaultValue: 'base',
                type: Sequelize.ENUM,
                values: [ 'accepted', 'declined', 'proposed', 'base' ]
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
        return queryInterface.dropTable('Categories');
    }
};
