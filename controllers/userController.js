const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
  getUser(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('thoughts')
      .populate('friends')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID exists' })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  createUser(req, res) {
    User.create(req.body)
      .then((users) => res.json(users))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((users) => {
        if (!users) {
          res.status(404).json({ message: 'No user exists with that ID!' });
        } else {
          User.deleteMany({ _id: { $in: users.friends } });
        }
      })
      .then(() => res.json({ message: 'User and thoughts have been deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((users) =>
        !users
          ? res.status(404).json({ message: 'No user exists with that ID!' })
          : res.json(users)
      )
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    ).then((users) =>
      !users
        ? res.status(404).json({ message: 'No user exists with that ID!' })
        : res.json(users)
    );
  },
};
