// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  db = require('../models');


//alphanum sorting function, for more natural sorting
//not strictly necessary, but added just in case for directory sorting
function alphanum(a, b) {
  function chunkify(t) {
    var tz = [], x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
}


module.exports = function(app) {

	app.get("/api/matrix", function(req, res){
		fs.readdir('../matrix', function(err, files){
			files.sort( alphanum );
			files.reverse();
			
			fs.readFile( files[0], function(err, data){
				res.json( data);

			});
		});
	});

	app.get('/matrix', isAuthenticated, function(req, res) {
	 	res.render('matrix');
	 });

	app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
	    if (req.user) {
	      res.redirect("/");
	    }
	    res.render('login');
	});

	app.get('/vacations',function(req, res){
		if (!req.user) {
			res.redirect('/');
		}
		db.Vacation.findAll({where: {UserId: req.user.id}})
				   .then( function( data ){
				   	 res.render('vacation', {vacation: data});
				   }).catch(function(error){
				   	 console.log(error.message);
				   });
	});

	app.get('/account',function(req, res){
		if (!req.user) {
			res.redirect('/');
		}
		db.User.findOne({where: {id: req.user.id}})
				   .then( function( data ){
				   	 res.render('account', {user: data});
				   }).catch(function(error){
				   	 console.log(error.message);
				   });
	});





}