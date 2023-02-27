const { ObjectId } = require('mongoose').Types;
const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  getThooughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.paramas.thoughtId })
      .select('-__v')
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: 'No thought exists with that ID' })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create({ thoughtText: req.body.thoughtText }, { new: true })
      .then((thoughts) => {
        User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thoughts } },
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
      { _id: req.paramas.thoughtId },
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
    Thought.findOneAndDelete({ _id: req.paramas.thoughtId })
      .then((thoughts) => {
        !thoughts
          ? res.status(404).json({ message: 'No thought exists with that ID!' })
          : res.json(thoughts);
      })
      .catch((err) => res.status(500).json(err));
  },
};
