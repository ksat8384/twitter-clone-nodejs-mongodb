const express = require("express");
const app = express();

const router = require("./router");

//To use our folder 'public'
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

//To listen to port 3000
app.listen(3000);
