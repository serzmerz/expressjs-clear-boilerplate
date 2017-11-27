'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('HourlyStats', [
            {
                userId: 41,
                totalFollowers: 550,
                totalLikes: 300,
                totalPosts: 540,
                lastTotalFollowers: 500,
                lastTotalLikes: 400,
                lastTotalPosts: 800,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 42,
                totalFollowers: 4000000,
                totalLikes: 32322200,
                totalPosts: 52212240,
                lastTotalFollowers: 50354330,
                lastTotalLikes: 40060,
                lastTotalPosts: 80420,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 43,
                totalFollowers: 532123250,
                totalLikes: 304323230,
                totalPosts: 543235230,
                lastTotalFollowers: 503453230,
                lastTotalLikes: 404532320,
                lastTotalPosts: 845324300,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 44,
                totalFollowers: 55760,
                totalLikes: 30430,
                totalPosts: 5430,
                lastTotalFollowers: 500,
                lastTotalLikes: 4030,
                lastTotalPosts: 1800,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 45,
                totalFollowers: 55450,
                totalLikes: 34300,
                totalPosts: 52140,
                lastTotalFollowers: 5000,
                lastTotalLikes: 4000,
                lastTotalPosts: 8000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 46,
                totalFollowers: 5550,
                totalLikes: 3040,
                totalPosts: 5340,
                lastTotalFollowers: 5090,
                lastTotalLikes: 4050,
                lastTotalPosts: 8020,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 47,
                totalFollowers: 5550,
                totalLikes: 3040,
                totalPosts: 5340,
                lastTotalFollowers: 5090,
                lastTotalLikes: 4050,
                lastTotalPosts: 8020,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 48,
                totalFollowers: 5550,
                totalLikes: 3040,
                totalPosts: 5340,
                lastTotalFollowers: 5090,
                lastTotalLikes: 4050,
                lastTotalPosts: 8020,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 49,
                totalFollowers: 5550,
                totalLikes: 3040,
                totalPosts: 5340,
                lastTotalFollowers: 5090,
                lastTotalLikes: 4050,
                lastTotalPosts: 8020,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 50,
                totalFollowers: 5550,
                totalLikes: 3040,
                totalPosts: 5340,
                lastTotalFollowers: 5090,
                lastTotalLikes: 4050,
                lastTotalPosts: 8020,
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
