
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
	console.log( req.body );
	var places = JSON.parse( req.body );
	if ( !places.places ) {
		// single place post
		places = {places : [ places ]};
	}
	// normalize one or more places into a single array
	places = places.places;
	
	// doctor, dentist, pharmacy, etc
	var placeType = req.params.placeType;
	
	for ( var i = 0; i < places.length; i++ ) {
		
	}
}