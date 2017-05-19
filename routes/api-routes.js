// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  isAdmin = require("../config/middleware/isAdmin"),
	  db = require('../models'),
	  moment = require('moment'),
	  fs = require('fs');

module.exports = function(app) {

	app.get("/api/matrix", function(req, res){
		// if (!req.user) {
	 //      // The user is not logged in, send back an empty object
	 //      res.json({});
	 //    }
	 //    else {
			fs.readdir('./matrix', function(err, files){
				console.log('files', files)
				files.sort( alphanum );
				files.reverse();
				
				fs.readFile( './matrix/'+files[0], function(err, data){
					console.log(data);
					res.json( JSON.parse(data) );

				});
			});
		//}
	});	 

	app.post('/api/matrix', function(req, res) {
		let filename = './matrix/Matrix_' + Date.now() + '.matrix';

		fs.writeFile(filename, req.body, { flag: "wx" }, function(err) {
			  if(err) {
			  	res.json('FAILURE');
			  }
		      res.json('Successfully wrote ' + filename );
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
		db.User.update( req.body, {where: {id: req.user.id }})
			   .then( function( data ){
					 console.log( data );
			   	 res.redirect('/account');
			   }).catch( function( error ) {
			   	 console.log(error.message);
			   });
	});

	app.post('/api/new-matrix', function(req, res) {
		db.Matrix.create( req.body )
				 .then( function(data) {
				 	res.redirect('/pop-matrix');
				 });
	});

	app.put('/api/matrix', isAuthenticated, isAdmin, function(req, res){
				for(var i in req.body.data ){
                    db.Matrix.update( req.body.data[i].newData, {where: {Pos: req.body.data[i].Pos } } )
                    		 .then( function(data){
                    		 	return;
                    	   }).catch( function( error ) {
                    		 	console.log(error);
                    		 	res.sendStatus(400);
                    	   });
				}
				res.json('success');
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