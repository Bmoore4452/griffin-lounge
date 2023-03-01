const { ObjectId } = require('mongoose').Types;
const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: 'No thought exists with that ID' })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughts) => {
        console.log(thoughts);
        User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thoughts._id } },
          { runValidators: true, new: true },
          (err, results) => (err ? res.json(err) : res.json(results))
        );
      })
      .then(() => {
        res.json({ message: 'thought created and added to user' });
      })
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: 'No thought exists with that ID!' })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thoughts) => {
        !thoughts
          ? res.status(404).json({ message: 'No thought exists with that ID!' })
          : res.json(thoughts);
      })
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thoughts) => {
        console.log(thoughts);
        !thoughts
          ? res.status(404).json({ message: 'No thought exists with that ID!' })
          : res.json(thoughts);
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thoughts) =>
        !thoughts
          ? res
              .status(404)
              .json({ message: 'No thought exists with that ID :(' })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
};
