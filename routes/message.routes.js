const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");
const ItemModel = require("../models/Item.model");
const MessageModel = require("../models/Message.model");

//====POST send message====//
router.post("/user/:userId/send", (req, res) => {
  // Recipient
  let userId = req.params.userId;

  //Sender
  let loggedInUserId = req.session.loggedInUser._id;

  const { body } = req.body;

  MessageModel.create({ from: loggedInUserId, to: userId, body })
    .then((message) => {
      UserModel.findByIdAndUpdate(userId, {
        $push: { messages: message },
      }).then((recipient) => {
        // console.log('This is to:',recipient);
        UserModel.findByIdAndUpdate(loggedInUserId, {
          $push: { messages: message },
        }).then((sender) => {
          // console.log('This is from:',sender);
          res.status(200).json(message);
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

//====GET all messages====//
router.get("/user/:userId/inbox", (req, res) => {
  let loggedInUserId = req.session.loggedInUser._id;
  UserModel.findById(loggedInUserId)
    .populate("messages")
    .then((user) => {
      let orderedByTime = user.messages.sort((a, b) => a - b);
      let conversation = [];
      for (let i = 0; i < orderedByTime.length; i++) {
        for (let j = 0; j < orderedByTime.length; j++) {
          if (
            orderedByTime[i].from != orderedByTime[j].from &&
            orderedByTime[i].to != orderedByTime[j].to &&
            orderedByTime[i].from != loggedInUserId &&
            orderedByTime[j].from != loggedInUserId &&
            i != j
          ) {
            conversation.push(orderedByTime[i]);
          }
        }
      }

      res.status(200).json(conversation);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====GET single chat====//
router.get("/user/inbox/:userId", (req, res) => {
  let loggedInUserId = req.session.loggedInUser._id;
  let userId = req.params.userId;

  MessageModel.find()
    .populate("from")
    .populate("to")
    .then((messages) => {
      let chat = messages.filter((message) => {
        return (
          (message.from._id == loggedInUserId && message.to._id == userId) ||
          (message.from._id == userId && message.to._id == loggedInUserId)
        );
      });
      res.status(200).json(chat);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;
