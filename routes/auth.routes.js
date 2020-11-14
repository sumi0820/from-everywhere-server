const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { isLoggedIn } = require("../helpers/auth-helper");
const UserModel = require("../models/User.model");

//====Sign up====//
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(500).json({
      errorMessage: "Please enter username, email and password",
    });
    return;
  }

  // const myRegex = new RegExp(
  //   /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  // );
  // if (!myRegex.test(email)) {
  //   res.status(500).json({
  //     errorMessage: "Email format not correct",
  //   });
  //   return;
  // }

  // const myPassRegex = new RegExp(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  // );
  // if (!myPassRegex.test(password)) {
  //   res.status(500).json({
  //     errorMessage:
  //       "Password needs to have 8 characters, a number and an Uppercase alphabet",
  //   });
  //   return;
  // }

  bcrypt.genSalt(12).then((salt) => {
    console.log("Salt: ", salt);
    bcrypt.hash(password, salt).then((passwordHash) => {
      UserModel.create({ email, username, password: passwordHash })
        .then((user) => {
          console.log(user);

          user.passwordHash = "***";
          req.session.loggedInUser = user;
          console.log(req.session);

          res.status(200).json(user);
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(500).json({
              errorMessage: "username or email entered already exists!",
            });
            return;
          } else {
            console.log(err);
            res.status(500).json({
              errorMessage: "Something went wrong! Go to sleep!",
            });
            return;
          }
        });
    });
  });
});

//====Sign up validation====//
router.post("/input-check/user", (req, res) => {
  let userInput = req.body;

  UserModel.find()
    .then((users) => {
      let checker = users.filter((user) => {
        return user.username.toLowerCase() == userInput.username;
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

//====Sign up validation====//
router.post("/input-check/email", (req, res) => {
  let userInput = req.body;
  UserModel.find()
    .then((users) => {
      let checker = users.filter((user) => {
        return user.email.toLowerCase() == userInput.email;
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

//====Sign in====//
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500).json({
      error: "Please enter Username. email and password",
    });
    return;
  }
  // const myRegex = new RegExp(
  //   /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  // );
  // if (!myRegex.test(email)) {
  //   res.status(500).json({
  //     error: "Email format not correct",
  //   });
  //   return;
  // }

  // Find if the user exists in the database
  UserModel.findOne({ email })
    .populate("item")
    .populate('feedback')
    .then((userData) => {
      //check if passwords match
      bcrypt
        .compare(password, userData.password)
        .then((doesItMatch) => {
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            userData.passwordHash = "***";
            req.session.loggedInUser = userData;
            console.log("Signin", req.session);
            res.status(200).json(userData);
          }
          //if passwords do not match
          else {
            res.status(500).json({
              error: "Passwords don't match",
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).json({
            error: "Email format not correct",
          });
          return;
        });
    })
    //throw an error if the user does not exists
    .catch((err) => {
      res.status(500).json({
        error: "Email format not correct",
        message: err,
      });
      return;
    });
});

//====Sign in Test Mode====//
router.post("/signin-test", (req, res) => {
  // Find if the user exists in the database
  UserModel.findOne({ email: "manish@gmail.com" })
    .populate("item")
    .populate('feedback')
    .then((userData) => {
      //check if passwords match
      bcrypt
        .compare("Test@12345", userData.password)
        .then((doesItMatch) => {
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            userData.passwordHash = "***";
            req.session.loggedInUser = userData;
            console.log("Signin", req.session);
            res.status(200).json(userData);
          }
          //if passwords do not match
          else {
            res.status(500).json({
              error: "Passwords don't match",
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).json({
            error: "Email format not correct",
          });
          return;
        });
    })
    //throw an error if the user does not exists
    .catch((err) => {
      res.status(500).json({
        error: "Email format not correct",
        message: err,
      });
      return;
    });
});

//====Logout====//
router.post("/logout",  isLoggedIn,(req, res) => {
  console.log('logout');
  req.session.destroy();
  res
    .status(204) //  No Content
    .send();
});

//====Session check====//
router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

module.exports = router;
