const AppError = require('../utils/appError');
const commentsModel = require('../model/comments.model');
const userModel = require('../model/users.model')
const catchAsync = require('../utils/catchAsync');

exports.commentExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await commentsModel.findOne({
    where: {
      id,
    },
    include: [
      {
        model:userModel
      }
    ]
  });
  if (!comment) {
    return next(new AppError('commento not found', 404));
  }
  req.comment = comment;
  next();
});
