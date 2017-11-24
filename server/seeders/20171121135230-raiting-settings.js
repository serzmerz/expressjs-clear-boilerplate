'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('RatingSettings', [
          {
              name: 'Total # of followers',
              value: 0.15,
              settingsKey: 'totalFollowers',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Total # of posts',
              value: 0.15,
              settingsKey: 'totalPosts',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Avg like on 12 posts',
              value: 0.15,
              settingsKey: 'avgLikes',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Avg comments on 12 posts',
              value: 0.15,
              settingsKey: 'avgComments',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Changes in # of followers (daily)',
              value: 0.2,
              settingsKey: 'changesFollowers',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Changes in # of posts (daily)',
              value: 0.2,
              settingsKey: 'changesPosts',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'Data field',
              value: 0,
              settingsKey: 'dataField',
              createdAt: new Date(),
              updatedAt: new Date()
          }
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
