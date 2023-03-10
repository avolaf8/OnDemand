'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Category)
      Item.hasMany(models.UserItem)
      Item.belongsToMany(models.User, { through: models.UserItem })
    }

    formatDate() {
      return this.createdAt.toISOString().split("T")[0]
    }
  }
  Item.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Item',
  });
  Item.beforeCreate((instance) => {
    instance.status = 'pending'
  })
  return Item;
};