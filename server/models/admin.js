'use strict';
module.exports = function(sequelize, DataTypes) {
    const Admin = sequelize.define('Admin', {
        login: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        classMethods: {
            associate(models) {
        // associations can be defined here
            }
        }
    });

    return Admin;
};
