'use strict';
module.exports = function(sequelize, DataTypes) {
    const DailyStats = sequelize.define('DailyStats', {
        userId: DataTypes.INTEGER,
        totalFollowers: DataTypes.INTEGER,
        totalLikes: DataTypes.INTEGER,
        totalPosts: DataTypes.INTEGER,
        lastTotalFollowers: DataTypes.INTEGER,
        lastTotalLikes: DataTypes.INTEGER,
        lastTotalPosts: DataTypes.INTEGER,
        calculatedRating: DataTypes.DOUBLE,
        calculatedRatingPrev: DataTypes.DOUBLE
    }, {
        classMethods: {
            associate(models) {
        // associations can be defined here
            }
        }
    });

    return DailyStats;
};
