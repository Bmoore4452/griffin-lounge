const router = require('express').Router();

const {
  getUser,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../../controllers/userController');

// api/users
router.route('/').get(getUser).get(getSingleUser).post(createUser).put(updateUser).delete(deleteUser);

// api/users/:userId
router.route('/:userId')

module.exports = router;
