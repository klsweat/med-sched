var db = require("../models");
var passport = require("../config/passport"),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    isAdmin = require("../config/middleware/isAdmin");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    
    res.redirect("/");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/add-user", isAuthenticated, isAdmin, function(req, res) {
    //check to see if user already exists
    db.User.findOne({where: {email: req.body.email}})
           .then( function (data) {
             if(data) { //if it does, tell them so
                let msg = 'ACCOUNT CREATION FAILED: Email already exists.'
                res.redirect('/admin/add-user?failed=true&msg=' + encodeURIComponent(msg) );
             }
             else{ //if it doesn't, create the new user
                db.User.create(req.body)
                       .then( function(data) {
                          res.redirect('/admin/add-user');
                      }).catch(function(err) {
                          console.log(err.message);
                          res.redirect('/admin/add-user?failed=true&msg=' + encodeURIComponent(err.message) );
                      });
             }
           }).catch(function(err) {
                console.log(err.message);
                res.redirect('/admin/add-user?failed=true&msg=' + encodeURIComponent(err.message) );
           });  
  });

  //identical to the above, but without an authentication check, for adding user if none exists in database
  app.post("/shush/about/this/secret/route/add-user", function(req, res) {
    db.User.findOne({where: {email: req.body.email}})
           .then( function (data) {
             if(data) {
                res.redirect('/admin/add-user?failed=true');
             }
             else{
                db.User.create(req.body)
                       .then( function(data) {
                          res.redirect('/admin/add-user');
                      }).catch(function(err) {
                          console.log(err.message);
                          res.sendStatus(400);
                      });
             }
           }).catch(function(err) {
                console.log(err.message);
                res.sendStatus(400);
           }); 
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
};