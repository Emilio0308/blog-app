const catchAsync = require('../utils/catchAsync');
const commentsModel = require('../model/comments.model');
exports.findAllComments = catchAsync(async (req, res, next) => {
  const comments = await commentsModel.findAll({
    where: {
      status: true,
    },
  });
  return res.status(200).json({
    message: 'succes',
    comments,
  });
});
exports.createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { sessionUser } = req;
  const { postId } = req.params;

  const newComment = await commentsModel.create({
    text,
    userId: sessionUser.id,
    postId,
  });
  return res.status(200).json({
    message: 'succes',
    newComment
  });
});
exports.findComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  return res.status(200).json({
    message: 'succes',
    comment,
  });
});
exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req;
  const { text } = req.body;

  await comment.update({ text });

  return res.status(200).json({
    message: 'succes',
  });
});
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: false });

  return res.status(200).json({
    message: 'succes',
  });
});
