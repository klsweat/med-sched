// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express"),
	  bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  path = require('path'),
	  session = require("express-session"),
	  db = require("./models"),// Requiring our models for syncing
	  passport = require('./config/passport'); //requiring passport as we've set it up for session stuff

// Sets up the Express App
// =============================================================
const app = express(),
	  PORT = process.env.PORT || 8679;

var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
    target : "http://localhost/",
    agent: http.globalAgent
});

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(path.join(__dirname, "./public")));

app.get('/examples/:project/:func', require('./config/examples'));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); 

// Routes =============================================================

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/admin-routes.js")(app);
require("./routes/passport-routes.js")(app);


// Syncing our sequelize models and then starting our express app
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});