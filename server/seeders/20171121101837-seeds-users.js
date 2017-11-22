'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Users', [
          {
              nickname: 'Super Mark',
              instagramId: 'super_mark',
              instagramToken: '',
              picture: '',
              accessTokenAuth0: '',
              registerEnded: true,
              pending: 'base',
              banned: false,
              categoryId: 3,
              country: 'England',
              calculatedRating: 123,
              calculatedRatingPrev: 12,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              nickname: 'Snezanna',
              instagramId: 'snezanna_queen',
              instagramToken: '',
              picture: '',
              accessTokenAuth0: '',
              registerEnded: true,
              pending: 'base',
              banned: false,
              categoryId: 3,
              country: 'England',
              calculatedRating: 123,
              calculatedRatingPrev: 12,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              nickname: 'Snezanna1',
              instagramId: 'snezanna_queen1',
              instagramToken: '',
              picture: '',
              accessTokenAuth0: '',
              registerEnded: false,
              pending: 'base',
              banned: false,
              categoryId: 3,
              country: 'England',
              calculatedRating: 123,
              calculatedRatingPrev: 12,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              nickname: 'Snezanna2',
              instagramId: 'snezanna_queen2',
              instagramToken: '',
              picture: '',
              accessTokenAuth0: '',
              registerEnded: true,
              pending: 'accepted',
              banned: false,
              categoryId: 3,
              country: 'England',
              calculatedRating: 123,
              calculatedRatingPrev: 12,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              nickname: 'Snezanna3',
              instagramId: 'snezanna_queen3',
              instagramToken: '',
              picture: '',
              accessTokenAuth0: '',
              registerEnded: true,
              pending: 'proposed',
              banned: false,
              categoryId: 3,
              country: 'England',
              calculatedRating: 123,
              calculatedRatingPrev: 12,
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
