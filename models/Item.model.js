const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "https://semantic-ui.com/images/wireframe/image.png",
    },
    condition: {
      type: String,
      required: true,
    },
    accepted: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    hi: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("item", itemSchema);
