const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  // message: [{
  //   type: ,
  // }],
});

module.exports = mongoose.model("item", itemSchema);
