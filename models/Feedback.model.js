const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedback: String,
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  rate: String,
});

module.exports = mongoose.model("feedback", feedbackSchema);
