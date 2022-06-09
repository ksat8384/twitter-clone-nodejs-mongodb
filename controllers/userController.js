/**
 * To manage users
 */

const { urlencoded } = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");

exports.sharedProfileData = async function (req, res, next) {
  let isFollowing = false;
  if (req.session.user) {
    isFollowing = await Follow.isVisitorFollowing(
      req.profileUser._id,
      req.visitorId
    );
  }

  req.isFollowing = isFollowing;
  next();
};

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
    //As soon as we access the flash object to retrieve the collection, it will remove that from the session
    res.render("home-guest", {
      regErrors: req.flash("regErrors"),
    });
  }
};

exports.ifUserExists = function (req, res, next) {
  User.findByUsername(req.params.username)
    .then(function (userDocument) {
      //Storing the userDocument in the req object, so that we could access it in the below profilePostsScreen function
      req.profileUser = userDocument;
      next();
    })
    .catch(function () {
      res.render("404");
    });
};

exports.profilePostsScreen = function (req, res) {
  //ask our post model for posts by a certain author id
  Post.findByAuthorId(req.profileUser._id)
    .then(function (posts) {
      res.render("profile", {
        posts: posts,
        //Fetching the data saved in req object in the above IfUserExists function
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar,
        isFollowing: req.isFollowing,
      });
    })
    .catch(function () {
      res.render("404");
    });
};
