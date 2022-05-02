/**
 * To manage users
 */

exports.login = function () {};

exports.logout = function () {};

exports.register = function (req, res) {
  res.send("Thanks for trying to register.");
};

exports.home = function (req, res) {
  //To render our home page template
  res.render("home-guest");
};
