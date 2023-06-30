const userModel = require('./users.model');
const postModel = require('./post.model');
const commentModel = require('./comments.model');
const PostImgModel = require('./postImg.model');

const initModel = () => {
  userModel.hasMany(postModel, { foreignKey: 'userId' });
  postModel.belongsTo(userModel, { foreignKey: 'userId' });

  postModel.hasMany(commentModel);
  commentModel.belongsTo(postModel);

  userModel.hasMany(commentModel);
  commentModel.belongsTo(userModel);

  postModel.hasMany(PostImgModel);
  PostImgModel.belongsTo(postModel);
};

module.exports = initModel;
