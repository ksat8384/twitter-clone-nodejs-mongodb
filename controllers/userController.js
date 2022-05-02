/**
 * To manage users
 */

const { urlencoded } = require("express");
const User = require("../models/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  //Passing a callback function to wait until we get a response for login from mongo db
  //Modern approach is promise based instead of traditional callback
  user.login(function (result) {
    res.send(result);
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
  //To render our home page template
  res.render("home-guest");
};
