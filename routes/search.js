
var db     = require( '../lib/db' ),
    logger = require( '../lib/logger' );

var exports = module.exports;

exports.getPlaces = function( req, res, next ) {
	// doctor, dentist, pharmacy, etc
	var placetype = req.params.placetype;
	
	req.collection.find( {}, function( err, cursor ) {
		cursor.toArray(function(err, items) {
			res.send( JSON.stringify( { count: items.length, places: items } ) );
		});
	});
	/*
	req.collection.count( {}, function( err, count ) {
		if ( err ) { return next( err ); }
		res.send( "There are " + count + " " + placetype + " places" );
	});
	*/
}

exports.setPlaces = function( req, res, next ) {
	console.log( req.body.doctorContent );
	var places = JSON.parse( req.body.doctorContent );
	if ( !places.places ) {
		// single place post
		places = {places : [ places ]};
	}
	// normalize one or more places into a single array
	places = places.places;
	
	// doctor, dentist, pharmacy, etc
	var placetype = req.params.placetype;
	
	for ( var i = 0; i < places.length; i++ ) {
		req.collection.insert( places[i] , function( err, docs ){ 
			console.log( "Inserted " + docs );
		});

	}
	res.redirect('/test/places/'+placetype+'/');

}
