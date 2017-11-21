'use strict';

module.exports = function(sequelize, DataTypes) {
    const Users = sequelize.define('Users', {
        instagramId: DataTypes.STRING,
        nickname: DataTypes.STRING,
        instagramToken: DataTypes.STRING,
        accessTokenAuth0: DataTypes.STRING,
        picture: DataTypes.STRING,
        pending: { type: DataTypes.ENUM, values: [ 'accepted', 'declined', 'proposed', 'base' ] },
        registerEnded: DataTypes.BOOLEAN,
        categoryId: DataTypes.INTEGER,
        country: DataTypes.STRING,
        calculatedRating: DataTypes.INTEGER,
        calculatedRatingPrev: DataTypes.INTEGER
    }, {
        tableName: 'Users',
        classMethods: {
            associate(models) {
                Users.belongsTo(models.Categories, { foreignKey: 'categoryId' });
            }
        }
    });

    return Users;
};
