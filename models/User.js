const { Schema, model } = require('mongoose');

// Schema for the User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'must be in email format'],
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
// Virtual property that gets the amount of friends a user has
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initializes the User model
const User = model('user', userSchema);

module.exports = User;
