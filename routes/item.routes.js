const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");
const ItemModel = require("../models/Item.model");

// const randomNum = (max, min) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

//====GET all item info====//
router.get("/items", (req, res) => {
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

//====GET randomized items info====//
// router.get("/items/random", (req, res) => {
//   ItemModel.find()
//     .then((items) => {
//       let randomItems = [];
//       for (let i = 0; i < 3; i++) {
//         randomItems.push(items[randomNum(items.length - 1, 0)]);
//       }
//   res.status(200).json(randomItems);
// })
// .catch((err) => {
//   res.status(500).json({
//     error: "Something went wrong",
//     message: err,
//   });
// });
// });

//====GET latest items info====//
// router.get("/items/latest", (req, res) => {
//   ItemModel.find()
//     .then((items) => {
//       let sorted = items.sort((a, b) => {
//         a.updatedAt - b.updatedAt;
//       });
//       if (items.length > 7) {
//         res.status(200).json(sorted.slice(0, 6));
//       } else {
//         res.status(200).json(sorted);
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: "Something went wrong",
//         message: err,
//       });
//     });
// });

//====GET location based items info====//
// router.get("/items/location", (req, res) => {
//   let loggedInUser = req.session.loggedInUser;
//   ItemModel.find()
//     .populate("user")
//     .then((items) => {
//       let sorted = items.filter((item) => {
//         return loggedInUser.location == item.user.location;
//       });
//       if (items.length > 4) {
//         res.status(200).json(sorted.slice(0, 4));
//       } else {
//         res.status(200).json(sorted);
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: "Something went wrong",
//         message: err,
//       });
//     });
// });

//====GET item detail info====//
router.get("/item/:itemId", (req, res) => {
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
router.get("/item-search", (req, res) => {
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
router.post("/item/:userId/accept", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.params.userId;

  //Logged in user
  UserModel.findById(loggedInUser._id).then((user) => {
    ItemModel.findByIdAndUpdate(user.item, {
      $set: {
        accepted: true,
      },
    })
      .then((item) => {
        UserModel.findById(userId).then((otherUser) => {
          ItemModel.findByIdAndUpdate(otherUser.item, {
            $set: {
              accepted: true,
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
router.post("/item/:userId/revoke", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  let userId = req.params.userId;

  //Logged in user
  UserModel.findById(loggedInUser._id).then((user) => {
    ItemModel.findByIdAndUpdate(user.item, {
      $set: {
        accepted: false,
      },
    })
      .then((item) => {
        UserModel.findById(userId).then((otherUser) => {
          ItemModel.findByIdAndUpdate(otherUser.item, {
            $set: {
              accepted: false,
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
