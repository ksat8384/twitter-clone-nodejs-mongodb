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
      //Updating session data in database
      req.session.user = { favColor: "blue", username: user.data.username };
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
  user.register();
  if (user.errors.length) {
    user.errors.forEach(function (error) {
      req.flash("regErrors", error);
    });
    req.session.save(function () {
      res.redirect("/");
    });
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
    //The second parameter, object is to show error once if there is an invalid login attempt
    //As soon as we access the flash object to retrieve the collection, it will remove that from the session
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};
