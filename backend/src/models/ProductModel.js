const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

let Product = null;
if (sequelize) {
  Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
  }, {
    tableName: 'products',
    timestamps: false,
  });
}

module.exports = Product;
