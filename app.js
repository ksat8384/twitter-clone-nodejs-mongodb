const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
//Flash package helps us to add or remove data from session
const flash = require("connect-flash");
const markdown = require("marked");
const csrf = require("csurf");
const app = express();
const sanitizeHTML = require("sanitize-html");

//Boiler plate code: session configuration
let sessionOptions = session({
  secret: "JavaScript is sooo cool",
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});
app.use(sessionOptions);
//To show flash message if the user credentials entered are wrong during login attempt
app.use(flash());

//To tell express to run this function for every request
app.use(function (req, res, next) {
  //make our markdown function available from within ejs templates
  res.locals.filterUserHTML = function (content) {
    return sanitizeHTML(markdown.parse(content), {
      allowedTags: [
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "strong",
        "bold",
        "i",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ],
      allowedAttributes: {},
    });
  };

  //make all error and success flash messages available from all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");

  //make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id;
  } else {
    req.visitorId = 0;
  }
  //make user session data available from within view template
  res.locals.user = req.session.user;
  next();
});

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

//To avoid Cross site request forgery(CSRF) attack
//Any req that modifies state must have csrf token, else request will be rejected
app.use(csrf());
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

//To use our router to load the home page
app.use("/", router);

app.use(function (err, req, res, next) {
  if (err) {
    if (err.code == "EBADCSRFTOKEN") {
      req.flash("errors", "Cross site request forgery detected.");
      req.session.save(() => res.redirect("/"));
    } else {
      res.render("404");
    }
  }
});

const server = require("http").createServer(app);
const io = require("socket.io")(server);

//Boiler plate code: Not worth memorising.
//Integrating express with socket.io
io.use(function (socket, next) {
  //making express session data available within the context of socket.io
  sessionOptions(socket.request, socket.request.res, next);
});

io.on("connection", function (socket) {
  //only if the user is logged in
  if (socket.request.session.user) {
    let user = socket.request.session.user;

    socket.emit("welcome", { username: user.username, avatar: user.avatar });

    socket.on("chatMessageFromBrowser", function (data) {
      //emitting to all connected users
      socket.broadcast.emit("chatMessageFromServer", {
        message: sanitizeHTML(data.message, {
          allowedTags: [],
          allowedAttributes: {},
        }),
        username: user.username,
        avatar: user.avatar,
      });
    });
  }
});

module.exports = server;
