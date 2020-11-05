const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");
const ItemModel = require("../models/Item.model");

//====GET user info====//
router.get("/user/:userId", (req, res) => {
  let userId = req.params.userId;
  UserModel.findById(userId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====Edit user info====//
router.patch("/user/:userId/user-edit", (req, res) => {
  let userId = req.params.userId;
  const { username, email, bio, location } = req.body;

  UserModel.findByIdAndUpdate(userId, {
    $set: { username: username, email: email, bio: bio, location: location },
  })
    .then((user) => {
      console.log("Successfully updated");
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====Create user item====//
router.post("/user/:userId/item-create", (req, res) => {
  let loggedInUser = req.session.loggedInUser;

  const { name, description, condition, image } = req.body;
  ItemModel.create({
    name,
    description,
    condition,
    image,
    user: loggedInUser,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;
