const { DataTypes } = require('sequelize');
const { db } = require('./../database/config');

const postModel = db.define('posts', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  content: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  status: {
    allowNull: false,
    type: DataTypes.ENUM('active', 'disable'),
    defaultValue: 'active',
  },
});

module.exports = postModel;
