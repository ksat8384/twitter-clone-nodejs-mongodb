/**
 * To manage users
 */

const { urlencoded } = require("express");
const User = require("../models/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  //Modern approach is promise based instead of traditional callback
  user
    .login()
    .then(function (result) {
      //To let our server remember session data in memory
      req.session.user = { favColor: "blue", username: user.data.username };
      res.send(result);
    })
    .catch(function (error) {
      res.send(error);
    });
};

exports.logout = function () {};

exports.register = function (req, res) {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Congrats, there are no errors.");
  }
};

exports.home = function (req, res) {
  //If session exist
  if (req.session.user) {
    res.render("./home-dashboard", { username: req.session.user.username });
  } else {
    //To render our home page template
    res.render("home-guest");
  }
};
