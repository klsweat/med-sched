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


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(path.join(__dirname, "./public")));

//method override for PUT and DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", 
				  resave: true, 
				  saveUninitialized: true,
				  cookie: {
				  	 secure: 'auto',
				  	 maxAge: 5*24*60*60*1000
				  } }));
app.use(passport.initialize());
app.use(passport.session()); 

// Routes =============================================================

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/admin-routes.js")(app);
require("./routes/passport-routes.js")(app);

//route for editable matrix table
//app.get('admin/matrix/api/new-api', require('./config/examples'));
app.get('examples/:project/:func', require('./config/examples'));

//route that redirects traffic to root if no route is found
//app.get('*', function(req, res) {
	//res.redirect('/');
//});

// Syncing our sequelize models and then starting our express app
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});