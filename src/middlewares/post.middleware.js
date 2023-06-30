const postModel = require('../model/post.model');
const userModel = require('../model/users.model');
const commentModel = require('../model/comments.model');
const PostImgModel = require('../model/postImg.model');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.validPost = catchAsync(async (req, res, next) => {
  const { id, postId } = req.params;
  const post = await postModel.findOne({
    where: {
      id: id || postId,
      status: 'active',
    },
    include: [
      {
        model: userModel,
        attributes: ['id', 'name', 'email', 'description'],
      },
      {
        model: commentModel,
      },
      {
        model: PostImgModel,
      },
    ],
  });
  if (!post) {
    return next(new AppError('post not found', 404));
  }
  req.user = post.user;
  req.post = post;
  next();
});

exports.ValidPostPerFindOne = catchAsync(async (req, res, next) => {
  const { id, postId } = req.params;
  const post = await postModel.findOne({
    where: {
      id: id || postId,
      status: 'active',
    },
    include: [
      {
        model: userModel,
        attributes: ['id', 'name', 'email', 'description', 'profileImgUrl'],
      },
      {
        model: commentModel,
        include: [
          {
            model: userModel,
            attributes: ['id', 'name', 'email', 'description', 'profileImgUrl'],
          },
        ],
      },
      {
        model: PostImgModel,
      },
    ],
  });
  if (!post) {
    return next(new AppError('post not found', 404));
  }
  req.user = post.user;
  req.post = post;
  next();
});
