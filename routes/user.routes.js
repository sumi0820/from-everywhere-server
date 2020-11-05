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

//====Edit user item====//
router.patch("/user/:userId/item-edit/:itemId", (req, res) => {
  let itemId = req.params.itemId;
  const { name, description, condition, image } = req.body;

  ItemModel.findByIdAndUpdate(itemId, {
    $set: {
      name: name,
      description: description,
      condition: condition,
      image: image,
    },
  })
    .then((item) => {
      console.log("Success");
      res.status(200).json(item);
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====Delete user item====//
router.delete("/user/:userId/item-delete/:itemId", (req, res) => {
  let itemId = req.params.itemId;
  ItemModel.findByIdAndDelete(itemId)
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
