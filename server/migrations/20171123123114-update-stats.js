'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn('DailyStats', 'calculatedRating', { type: Sequelize.DOUBLE, defaultValue: 0 });
      queryInterface.addColumn('DailyStats', 'calculatedRatingPrev', { type: Sequelize.DOUBLE, defaultValue: 0 });
      queryInterface.addColumn('WeeklyStats', 'calculatedRating', { type: Sequelize.DOUBLE, defaultValue: 0 });
      queryInterface.addColumn('WeeklyStats', 'calculatedRatingPrev', { type: Sequelize.DOUBLE, defaultValue: 0 });
      queryInterface.addColumn('MonthlyStats', 'calculatedRating', { type: Sequelize.DOUBLE, defaultValue: 0 });
      queryInterface.addColumn('MonthlyStats', 'calculatedRatingPrev', { type: Sequelize.DOUBLE, defaultValue: 0 });
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
