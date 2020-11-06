const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    body: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);
