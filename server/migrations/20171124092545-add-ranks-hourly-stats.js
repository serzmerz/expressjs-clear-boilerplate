'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        queryInterface.addColumn('HourlyStats', 'calculatedRating', { type: Sequelize.INTEGER, defaultValue: 0 });
        queryInterface.addColumn('HourlyStats', 'calculatedRatingPrev', { type: Sequelize.INTEGER, defaultValue: 0 });
    },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
