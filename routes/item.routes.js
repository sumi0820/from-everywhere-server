const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");
const ItemModel = require("../models/Item.model");

const randomNum = (max, min) =>
  Math.floor(Math.random() * (max - min + 1) + min);

//====GET all item info====//
router.get("/items", (req, res) => {
  ItemModel.find()
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

//====GET randomized items info====//
router.get("/items/random", (req, res) => {
  ItemModel.find()
    .then((items) => {
      let randomItems = [];
      for (let i = 0; i < 5; i++) {
        randomItems.push(items[randomNum(items.length - 1, 0)]);
      }
      res.status(200).json(randomItems);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====GET item detail info====//
router.get("/items/:itemId", (req, res) => {
  let itemId = req.params.itemId;

  ItemModel.findById(itemId)
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});


module.exports = router;
