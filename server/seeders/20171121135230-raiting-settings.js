'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('RatingSettings', [
          {
              name: 'Total # of followers',
              value: 0.15,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Total # of posts',
              value: 0.15,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Avg like on 12 posts',
              value: 0.15,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Avg comments on 12 posts',
              value: 0.15,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Changes in # of followers (daily)',
              value: 0.2,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Changes in # of posts (daily)',
              value: 0.2,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Data field',
              value: 0,
              createdAt: new Date(),
              updatedAt: new Date()
          },
      ], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
