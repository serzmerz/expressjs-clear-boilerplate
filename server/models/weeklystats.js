'use strict';
module.exports = function(sequelize, DataTypes) {
    const WeeklyStats = sequelize.define('WeeklyStats', {
        userId: DataTypes.INTEGER,
        totalFollowers: DataTypes.INTEGER,
        totalLikes: DataTypes.INTEGER,
        totalPosts: DataTypes.INTEGER,
        lastTotalFollowers: DataTypes.INTEGER,
        lastTotalLikes: DataTypes.INTEGER,
        lastTotalPosts: DataTypes.INTEGER
    }, {
        classMethods: {
            associate(models) {
        // associations can be defined here
            }
        }
    });

    return WeeklyStats;
};
