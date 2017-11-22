'use strict';
module.exports = function(sequelize, DataTypes) {
    const RatingSetting = sequelize.define('RatingSetting', {
        name: DataTypes.STRING,
        value: DataTypes.REAL
    }, {
        classMethods: {
            associate(models) {
        // associations can be defined here
            }
        }
    });

    return RatingSetting;
};
