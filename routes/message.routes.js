const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");
const ItemModel = require("../models/Item.model");
const MessageModel = require("../models/Message.model");

//====POST send Hi====//
router.post("/send-hi/:userId",  isLoggedIn,(req, res) => {
  // Recipient
  let userId = req.params.userId;

  //Sender
  let loggedInUserId = req.session.loggedInUser._id;
  UserModel.findById(userId).then((user) => {
    MessageModel.create({
      from: loggedInUserId,
      to: userId,
      body: `Hi ${user.username}! I'm keen in your item!`,
    })
      .then((message) => {
        // Recipient
        UserModel.findByIdAndUpdate(userId, {
          $push: { messages: message },
        })
          .populate("item")
          .then((recipient) => {
            //Sender
            UserModel.findByIdAndUpdate(loggedInUserId, {
              $push: { messages: message },
            }).then((sender) => {
              ItemModel.findByIdAndUpdate(recipient.item._id, {
                $push: { hi: loggedInUserId },
              }).then((item) => {
                res.status(200).json(recipient);
              });
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

//====POST send message====//
router.post("/send/:userId",  isLoggedIn,(req, res) => {
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
        }).then(() => {
          MessageModel.find()
            .populate("from")
            .populate("to")
            .then((messages) => {
              console.log(messages);
              let chat = messages.filter((message) => {
                return (
                  (message.from._id == loggedInUserId &&
                    message.to._id == userId) ||
                  (message.from._id == userId &&
                    message.to._id == loggedInUserId)
                );
              });
              console.log(chat.length);
              res.status(200).json(chat);
            });
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
router.get("/inbox", isLoggedIn, (req, res) => {
  let loggedInUserId = req.session.loggedInUser._id;
  UserModel.findById(loggedInUserId)
    .populate("messages")
    .populate({
      path: "messages",
      populate: {
        path: "from",
      },
    })
    .then((user) => {
      let conversation = [];
      let orderedByTime = user.messages
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter((chat) => {
          return chat.from._id != loggedInUserId;
        });
      let uniqueUserIds = [];
      orderedByTime.forEach((chat) => {
        if (!conversation.length || !uniqueUserIds.includes(chat.from._id)) {
            conversation.push(chat);
            uniqueUserIds.push(chat.from._id);
          }     
      });
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
router.get("/chat/:userId",  isLoggedIn,(req, res) => {
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
