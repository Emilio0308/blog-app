const express = require('express');
const userController = require('../controllers/users.controller');

const userMiddleware = require('./../middlewares/users.middleware');
const { restrictTo, protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect)

router.get('/', restrictTo('admin','root'), userController.findAllUsers);

router
  .route('/:id')
  .get(userMiddleware.validUser, userController.findOneUser)
  .patch(userMiddleware.validUser, userController.updateUser)
  .delete(userMiddleware.validUser, userController.deleteUser);

module.exports = router;
