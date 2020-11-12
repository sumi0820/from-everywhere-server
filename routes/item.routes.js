const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");
const ItemModel = require("../models/Item.model");

//====GET all item info====//
router.get("/items", isLoggedIn, (req, res) => {
  ItemModel.find()
    .populate("user")
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====GET item detail info====//
router.get("/item/:itemId",  (req, res) => {
  let itemId = req.params.itemId;
  ItemModel.findById(itemId)
    .populate("user")
    .then((item) => {
      console.log(item);
      res.status(200).json(item);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====Search item=====//
router.get("/item-search",  (req, res) => {
  console.log("test");
  const userInput = req.query.q;
  console.log(req.query.q);
  ItemModel.find()
    .then((items) => {
      const filteredItems = items.filter((item) => {
        return item.name.toLowerCase().includes(userInput);
      });
      res.status(200).json(filteredItems);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====Update item status=====//
router.post("/item/:userId/accept", isLoggedIn, (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.params.userId;

  //Logged in user
  UserModel.findById(loggedInUser._id).then((user) => {
    ItemModel.findByIdAndUpdate(user.item, {
      $set: {
        accepted: userId,
      },
    })
      .then((item) => {
        UserModel.findById(userId).then((otherUser) => {
          ItemModel.findByIdAndUpdate(otherUser.item, {
            $set: {
              accepted: loggedInUser._id,
            },
          }).then((otherItem) => {
            res.status(200).json(item);
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Something went wrong",
          message: err,
        });
      });
  });
});

//====Revoke item status====//
router.post("/item/:userId/revoke", isLoggedIn, (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.params.userId;

  //Logged in user
  UserModel.findById(loggedInUser._id).then((user) => {
    ItemModel.findByIdAndUpdate(user.item, {
      $set: {
        accepted: null,
      },
    })
      .then((item) => {
        UserModel.findById(userId).then((otherUser) => {
          ItemModel.findByIdAndUpdate(otherUser.item, {
            $set: {
              accepted: null,
            },
          }).then((otherItem) => {
            res.status(200).json(item);
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Something went wrong",
          message: err,
        });
      });
  });
});

module.exports = router;
