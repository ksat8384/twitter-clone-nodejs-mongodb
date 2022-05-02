/**
 * To list out our application's different routes to direct traffic
 */

const express = require("express");

//Express will return a mini application or router
const router = express.Router();

const userController = require("./controllers/userController");

router.get("/", userController.home);

router.post("/register", userController.register);

router.post("/login", userController.login);

module.exports = router;
