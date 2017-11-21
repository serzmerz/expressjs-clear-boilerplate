'use strict';
module.exports = function(sequelize, DataTypes) {
    const Categories = sequelize.define('Categories', {
        name: DataTypes.STRING,
        pending: { type: DataTypes.ENUM, values: [ 'accepted', 'declined', 'proposed', 'base' ] }
    }, {
        tableName: 'Categories',
        classMethods: {
            associate(models) {
            }
        }
    });

    return Categories;
};
