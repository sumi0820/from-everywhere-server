const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");
const ItemModel = require("../models/Item.model");
const FeedbackModel = require("../models/Feedback.model");

//====GET user info====//
router.get("/user/:userId", (req, res) => {
  let userId = req.params.userId;
  UserModel.findById(userId)
    .populate("item")
    .populate("feedback")
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
router.patch("/user-edit", isLoggedIn, (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  const { bio, location, imageProfile, imageBg, username, email } = req.body;

  UserModel.findByIdAndUpdate(loggedInUser, {
    $set: {
      username: username,
      email: email,
      bio: bio,
      location: location,
      imageProfile: imageProfile == null ? loggedInUser.imageProfile : imageProfile,
      imageBg: imageBg == null ? loggedInUser.imageBg : imageBg,
    },
  }).then((oldUser) => {
    UserModel.findById(loggedInUser)
      .then((newUser) => {
        res.status(200).json(newUser);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Something went wrong",
          message: err,
        });
      });
  });
});

//====Edit validation====//
router.post("/input-check/edit-user", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userInput = req.body;

  UserModel.find()
    .then((users) => {
      let checker = users.filter((user) => {
        return (
          user.username.toLowerCase() == userInput.username &&
          loggedInUser.username.toLowerCase() !== userInput.username
        );
      });
      return checker.length ? res.status(200).json("isUser") : null;
    })
    .catch(() => {
      res.status(500).json({
        error: "Something went wrong",
      });
      return;
    });
});

//====Edit validation====//
router.post("/input-check/edit-email", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userInput = req.body;
  UserModel.find()
    .then((users) => {
      let checker = users.filter((user) => {
        return (
          user.email.toLowerCase() == userInput.email &&
          loggedInUser.email.toLowerCase() !== userInput.email
        );
      });
      return checker.length ? res.status(200).json("isEmail") : null;
    })
    .catch(() => {
      res.status(500).json({
        error: "Something went wrong",
      });
      return;
    });
});

//====Create user item====//
router.post("/item-create", isLoggedIn, (req, res) => {
  let loggedInUser = req.session.loggedInUser;

  const { name, description, condition, image } = req.body;
  ItemModel.create({
    name,
    description,
    condition,
    image,
    user: loggedInUser,
  })
    .then((item) => {
      UserModel.findByIdAndUpdate(loggedInUser, {
        $set: {
          item: item,
        },
      }).then(() => {
        ItemModel.find().then((items) => {
          res.status(200).json(items);
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====Edit user item====//
router.patch("/item-edit", isLoggedIn, (req, res) => {
  let itemId = req.session.loggedInUser.item;
  const { name, description, condition, image } = req.body;
  ItemModel.findById(itemId).then((item) => {
    ItemModel.findByIdAndUpdate(itemId, {
      $set: {
        name: name,
        description: description,
        condition: condition,
        image: image == null ? item.image : image,
      },
    })
      .then(() => {
        ItemModel.find().then((items) => {
          res.status(200).json(items);
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

//====Delete user item====//
router.delete("/item-delete/:itemId", isLoggedIn, (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let itemId = req.params.itemId;

  ItemModel.findByIdAndDelete(itemId)
    .then(() => {
      UserModel.findByIdAndUpdate(loggedInUser._id, {
        $set: {
          item: [],
        },
      });
    })
    .then((user) => {
      ItemModel.find().then((items) => {
        res.status(200).json(items);
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//====Update user item====//
router.post("/user/:userId/update-status", isLoggedIn, (req, res) => {
  let userId = req.params.userId;

  UserModel.findById(userId).then((user) => {
    ItemModel.findByIdAndUpdate(user.item, {
      $set: {
        accepted: null,
        hi: [],
      },
    })
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
});

//=====Create Feedback=====//
router.post("/user/:userId/create-feedback", isLoggedIn, (req, res) => {
  const { feedback, rate } = req.body;
  let userId = req.params.userId;

  UserModel.findById(userId)
    .populate("item")
    .then((user) => {
      FeedbackModel.create({
        feedback: feedback,
        rate: rate,
        to: user.item.accepted,
        from: userId,
      })
        .then((feedback) => {
          UserModel.findByIdAndUpdate(user.item.accepted, {
            $push: { feedback: feedback },
          }).then(() => {
            res.status(200).json(feedback);
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

//====GET Feedback(from!=loggedinUser)====//
router.get("/feedback", (req, res) => {
  FeedbackModel.find()
    .populate("from")
    .populate("to")
    .then((feedbacks) => {
      res.status(200).json(feedbacks);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;
