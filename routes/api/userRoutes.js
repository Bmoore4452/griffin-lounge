const router = require('express').Router();

const {
  getUser,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
} = require('../../controllers/userController');

// api/users
router.route('/').get(getUser).post(createUser);

router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend);

module.exports = router;
