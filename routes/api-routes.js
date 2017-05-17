// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  db = require('../models'),
	  moment = require('moment');

module.exports = function(app) {

	app.get("/api/matrix", function(req, res){
		if (!req.user) {
	      // The user is not logged in, send back an empty object
	      res.json({});
	    }
	    else {
			fs.readdir('../matrix', function(err, files){
				files.sort( alphanum );
				files.reverse();
				
				fs.readFile( files[0], function(err, data){
					res.json( data);

				});
			});
		}
	});	 

	app.post('/api/matrix', function(req, res) {
		let filename = 'Matrix_' + Date.now();

		fs.writeFile(filename, req.body, { flag: "wx" }, function(err) {
		      res.end();
		  });
	});

	app.post('/vacation', isAuthenticated, function(req, res) {
		req.body.start_date =  moment(req.body.start_date).format('YYYY-MM-DD') ;
		req.body.end_date =  moment(req.body.end_date).format('YYYY-MM-DD') ;
		req.body.UserId = req.user.id;
		db.VacationRequest.create( req.body )
				   .then( function( data ) {
				   	 res.redirect('/vacations');
				   }).catch( function( error ) {
				   	 console.log(error.message);
				   });
		
	});


	app.put('/account', isAuthenticated, function(req, res) {
		db.User.update( req.body, {where: {id: req.body.id }})
			   .then( function( data ){
					 console.log( data );
			   	 res.redirect('/account');
			   }).catch( function( error ) {
			   	 console.log(error.message);
			   });
	});
}



//alphanum sorting function, for more natural sorting
//probably not necessary, but added just in case for directory sorting
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