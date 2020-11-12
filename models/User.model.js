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
    imageProfile: {
      type: String,
      default: "https://semantic-ui.com/images/wireframe/image.png",
    },
    imageBg: {
      type: String,
      default:
        "https://images.pexels.com/photos/3359714/pexels-photo-3359714.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    bio: String,
    location: String,
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
      default: undefined,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
      },
    ],
    feedback: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "feedback",
      },
    ],
    accepted: {
      type: String,
      default: null,
    },
    like: [String],
  }

);

module.exports = mongoose.model("user", userSchema);
