'use strict';
module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        instagramId: DataTypes.STRING,
        nickname: DataTypes.STRING,
        instagramToken: DataTypes.STRING,
        accessTokenAuth0: DataTypes.STRING,
        picture: DataTypes.STRING,
        pending: DataTypes.BOOLEAN,
        registerEnded: DataTypes.BOOLEAN,
        categoryId: DataTypes.INTEGER,
        country: DataTypes.STRING,
        calculatedRating: DataTypes.INTEGER,
        calculatedRatingPrev: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                User.belongsTo(models.Category, { foreignKey: 'categoryId' })
            }
        }
    });

    return User;
};
