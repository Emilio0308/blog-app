const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Comment = db.define('comments', {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  text: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  postId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
});


module.exports = Comment;
