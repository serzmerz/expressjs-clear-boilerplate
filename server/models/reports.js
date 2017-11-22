'use strict';
module.exports = function(sequelize, DataTypes) {
    const Reports = sequelize.define('Reports', {
        userId: DataTypes.INTEGER,
        reason: { type: DataTypes.ENUM, values: [ 'Spam', 'Inappropriate' ] },
        count: DataTypes.INTEGER
    }, {
        classMethods: {
            associate(models) {
                // associations can be defined here
            }
        }
    });

    return Reports;
};
