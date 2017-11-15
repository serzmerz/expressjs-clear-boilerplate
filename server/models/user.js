'use strict';
module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING
    }, {
        classMethods: {
            associate(models) {
                // associations can be defined here
            }
        }
    });

    return User;
};
