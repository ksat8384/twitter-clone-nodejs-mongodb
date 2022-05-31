/**
 * To manage users
 */

const { urlencoded } = require("express");
const User = require("../models/User");

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash("errors", "You must be logged in to perform that action.");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};

exports.login = function (req, res) {
  let user = new User(req.body);
  //Modern approach is promise based instead of traditional callback
  user
    .login()
    .then(function (result) {
      //To let our server remember session data in memory
      //Updating session data in database
      req.session.user = {
        avatar: user.avatar,
        username: user.data.username,
        _id: user.data._id,
      };
      //To only redirect after the session data is saved in the database
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (error) {
      //To add a flash object on the req object
      req.flash("errors", error);
      //To only redirect after the session data is updated in the database
      req.session.save(function () {
        //To redirect the user to home page, incase of failed login attempt
        res.redirect("/");
      });
    });
};

exports.logout = function (req, res) {
  //Destroying the current session from mongodb
  req.session.destroy(function () {
    //To redirect the user to home page
    res.redirect("/");
  });
};

exports.register = function (req, res) {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      //setting the session data
      req.session.user = {
        username: user.data.username,
        avatar: user.avatar,
        _id: user.data._id,
      };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch((regErrors) => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error);
      });
      req.session.save(function () {
        res.redirect("/");
      });
    });
};

exports.home = function (req, res) {
  //If session exist
  if (req.session.user) {
    res.render("./home-dashboard");
  } else {
    //To render our home page template
    //The second parameter, object is to show error once if there is an invalid login attempt
    //As soon as we access the flash object to retrieve the collection, it will remove that from the session
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};

exports.ifUserExists = function (req, res, next) {
  next();
};

exports.profilePostsScreen = function (req, res) {
  res.render("profile");
};
