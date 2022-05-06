const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

//Boiler plate code: session configuration
let sessionOptions = session({
  secret: "JavaScript is sooo cool",
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});
app.use(sessionOptions);

const router = require("./router");

//Boiler plate code: To tell express, to add the user submitted data on to our request object, for us to access it using req.body
//HTML form submit
app.use(express.urlencoded({ extended: false }));
//Sending over json data
app.use(express.json());

//To use our folder 'public' for our views
app.use(express.static("public"));
/**
 * To set views configuration option to our folder 'views'.
 * This will let express know where to find our views/templates
 */
app.set("views", "views");
//To let express know which templating engine we are using. Here we are using ejs engine
app.set("view engine", "ejs");

//To use our router to load the home page
app.use("/", router);

module.exports = app;
