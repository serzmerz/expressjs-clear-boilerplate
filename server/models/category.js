'use strict';
module.exports = function(sequelize, DataTypes) {
    const Categories = sequelize.define('Categories', {
        name: DataTypes.STRING,
        pending: DataTypes.BOOLEAN
    }, {
        tableName: 'Categories',
        classMethods: {
            associate(models) {
            }
        }
    });

    return Categories;
};
