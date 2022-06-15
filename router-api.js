const apiRouter = require("express").Router();

apiRouter.post("/login", function (req, res) {
  res.json("Thank you for trying to login from API.");
});

module.exports = apiRouter;
