const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://semantic-ui.com/images/wireframe/image.png",
    },
    bio: String,
    location: String,
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    }],
  },
  // {
  //   timestamps: true,
  // }
);

module.exports = mongoose.model("user", userSchema);
