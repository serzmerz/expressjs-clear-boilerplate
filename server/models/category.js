'use strict';
module.exports = function(sequelize, DataTypes) {
    const Category = sequelize.define('Category', {
        name: DataTypes.STRING,
        pending: { type: DataTypes.ENUM, values: [ 'accepted', 'declined', 'proposed', 'base' ] }
    }, {
        classMethods: {
            associate: function (models) {
                Category.hasMany(models.User)
            }
        }
    });
    return Category;
};
