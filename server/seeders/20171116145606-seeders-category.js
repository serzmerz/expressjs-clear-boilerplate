'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Categories', [
            {
                name: 'Category#1',
                pending: 'base',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Category#2',
                pending: 'base',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Category#3',
                pending: 'base',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Category#4',
                pending: 'accepted',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Category#5',
                pending: 'proposed',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    }
};
