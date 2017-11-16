'use strict';
module.exports = function(sequelize, DataTypes) {
    const Category = sequelize.define('Category', {
        name: DataTypes.STRING,
        pending: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function (models) {
                Category.hasMany(models.User, { foreignKey: 'categoryId' })
            }
        }
    });
    return Category;
};
