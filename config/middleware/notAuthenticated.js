module.exports = function(req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  if (!req.user) {
    return next();
  }
  console.log('Already logged in. Redirecting from notAuthenticated.')
  // If the user isnt' logged in, redirect them to the login page
  return res.redirect("/");
};