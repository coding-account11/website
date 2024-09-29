const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { ensureAuthenticated, isSubscribed } = require("./authentication");
var LocalStorage = require("node-localstorage").LocalStorage,
  localStorage = new LocalStorage("./scratch");

require("dotenv").config();
const bcrypt = require('bcrypt');
const User = require("../models/user");

let month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
router.get("/otp-page", (req, res) => {
  if (req.user) {
    req.flash("error_msg", "You are logged in already. Logout first.");
    res.redirect("/");
  } else {
    let page = "phone-login";
    let params = {
      title: "Create Account",
      style: page,
      js: page,
      first: {
        value: "",
        error: null,
      },
      second: {
        value: "",
        error: null,
      },
      third: {
        value: "",
        error: null,
      },
      fourth: {
        value: "",
        error: null,
      },
      data: req.query.user,
    };
    console.log(req.query.user);
    res.render(page, params);
  }
});
//register User

router.post(
  "/register",
  [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .bail()
      .isLength({ min: 5, max: 20 })
      .withMessage("Username must be 5-20 characters long")
      .bail()
      .matches(/[a-zA-Z]\w{5,20}$/)
      .withMessage("username must contain letters a-z or A-Z or numbers 0-9")
      .bail()
      .custom(async (value, { req }) => {
        return new Promise((resolve, reject) => {
          User.getUserByUsername(value, (err, user) => {
            if (err) {
              reject(new Error("Server Error"));
            }
            if (Boolean(user)) {
              reject(new Error("Username already in use"));
            }
            resolve(true);
          });
        });
      }),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email is invalid")
      .bail()
      .custom(async (value, { req }) => {
        return new Promise((resolve, reject) => {
          User.getUserByEmail(value, (err, user) => {
            if (err) {
              reject(new Error("Server Error"));
            }
            if (Boolean(user)) {
              reject(new Error("Email already in use"));
            }
            resolve(true);
          });
        });
      }),
    check("pass")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .bail()
      .matches(/[\w\.\@\+\-]$/)
      .withMessage(
        "password must only contain alphanumeric characters or '.', '@', '+', '_', '-'"
      )
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.confPass) return false;
        else return true;
      })
      .withMessage("Passwords does not match"),
  ],
 async (req, res) => {
    let errors = validationResult(req);
    let usernameErr = null,
      emailErr = null,
      passErr = null;

    if (errors.errors.length) {
      errors.errors.forEach((error) => {
        if (error.param === "username") usernameErr = error;
        if (error.param === "email") emailErr = error;
        if (error.param === "pass") passErr = error;
      });
      let page = "login";
      let params = {
        first: {
          value: req.body.username,
          error: usernameErr,
        },
        second: {
          value: req.body.email,
          error: emailErr,
        },
        third: {
          value: req.body.pass,
          error: passErr,
        },
        title: "Create Account",
        style: page,
        js: page,
      };
      res.render("register", params);
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.pass, saltRounds);
      let currDate = new Date();
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        joined: currDate,
        bio: null,
        title: null,
        location: null,
        imageURL: null,
        subscription: false,
        videoCount: 0,
        playVideos: [],
        courses: [],
      });

      let userJson = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.pass,
        joined: currDate,
        bio: null,
        title: null,
        location: null,
        imageURL: null,
        subscription: false,
        videoCount: 0,
        playVideos: [],
        courses: [],
      };

      // console.log('After Redirection');
      // //code removed
      // req.flash(
      //   'User', newUser
      // )
      // d = JSON.stringify(userJson);
      // res.redirect("/users/otp-page?user=" + d);

      // // res.redirect("/users/go-with-it?user=" + d);
      // console.log("newUser : ", newUser);

      // Save the new user to the database
      newUser.save((err) => {
        if (err) {
          // If there's an error saving the user, log it and redirect back to registration
          console.log(err);
          req.flash("error_msg", "There was an error registering the user");
          res.redirect("pages/register-page");
        } else {
          // If user saved successfully, flash a success message and redirect to login page
          req.flash(
            "success_msg",
            "You are successfully registered. Please log in."
          );
          res.redirect("/pages/login-page");
        }
      });
    }
  }
);

router.get("/go-with-it", (req, res) => {
  console.log("query data", req.query);
  var newuser = JSON.parse(req.query.data);
  var newUser = new User(newuser);
  if (newUser) {
    User.createUser(newUser, (err, user) => {
      if (err) throw err;
    });
  }
  // req.flash(
  //   "success_msg",
  //   "You have successfully registered. Proceed to Login"
  // );
  // res.json({msg : "You have successfully registered. Proceed to Login"})
  res.redirect("/");
});

router.post("/updateUser", ensureAuthenticated, (req, res) => {
  // if (!req.paymentStatus) {
  //   req.flash("error_msg", "Please subscribe to add course!");
  //   res.redirect("/pages/pricing-table-page");
  // }

  let { bio, title, location } = req.body;
  let newData = {};
  if (bio !== req.user.bio) {
    newData.bio = bio;
  }
  if (title !== req.user.title) {
    newData.title = title;
  }
  if (location !== req.user.location) {
    newData.location = location;
  }
  User.updateUserById(req.user._id, newData, (err, doc) => {
    if (err) {
      return res.send(`Error occured while updating profile: ${err.msg}`);
    } else {
      req.flash("success_msg", "Your profile changes are saved successfully");
      res.redirect("/users/profile");
    }
  });
});

router.get("/profile", ensureAuthenticated, (req, res) => {
  let result;
  let { username } = req.user;
  User.getUserProfileByUsername(username, (err, user) => {
    if (err) return res.send(err);
    if (!user) return res.send("No such user found");
    else {
      result = user;
      result.joinDate = `${
        month[req.user.joined.getMonth()]
      } ${req.user.joined.getFullYear()}`;
      let page = "personal-details";
      let params = {
        result: result,
        isSubscribed: req.paymentStatus,
        user: req.user,
        title: "Your profile",
        style: page,
        js: page,
      };
      return res.render(page, params);
    }
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pass",
    },
    async (username, password, done) => {
      if (username.indexOf("@") === -1) {
        User.getUserByUsername(username, (err, user) => {
          if (err) throw err;
          if (!user) {
            return done(null, false, {
              message: "This Username does not exist",
            });
          }

          const isMatch = bcrypt.compare(password, user.password);
        
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      } else {
        User.getUserByEmail(username, (err, user) => {
          if (err) throw err;
          if (!user) {
            return done(null, false, { message: "This Email does not exist" });
          }

          User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect password" });
            }
          });
        });
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserByID(id, function (err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/pages/login-page",
    failureFlash: true,
  }),
  async (req, res) => {
    const { email } = req.body;
    localStorage.setItem("email", email);
    res.redirect(`/`);
  }
);

//render logout
router.get("/logout", ensureAuthenticated, async (req, res) => {
  req.logOut();
  localStorage.removeItem("email");
  req.flash("success_msg", "You are logged out");

  res.redirect("/pages/login-page");
});

router.get("/phone", async (req, res) => {
  const mobileNumber = req.query.phone;
  console.log(mobileNumber);
  if (mobileNumber) {
    const user = await User.findOne({ phone: mobileNumber });
    if (user) {
      res.send({ exists: true });
    } else {
      res.send({ exists: false });
    }
  } else {
    res.send({ error: "Not Found" });
  }
});

module.exports = router;

// .isLength({ min: 8, max: 15 }).withMessage('Password must be 8-15 characters long').bail()
