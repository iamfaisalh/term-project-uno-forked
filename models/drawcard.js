'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DrawCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DrawCard.belongsTo(models.Game, {
        foreignKey: 'gameId',
        onDelete: 'CASCADE'
      });
      DrawCard.belongsTo(models.Card, {
        foreignKey: 'cardId',
        onDelete: 'CASCADE'
      });
    }
  }
  DrawCard.init({
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DrawCard',
  });
  return DrawCard;
};