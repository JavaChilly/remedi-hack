
var db     = require( '../lib/db' ),
    logger = require( '../lib/logger' );

var exports = module.exports;

exports.mapPlaces = function( req, res, next ) {
	res.locals.provider = req.query.provider || 'Cheap+Medical';
	res.render("map_places", { provider: res.locals.provider });
	res.end();
}


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

exports.listPlaces = function( req, res, next ) {
	// doctor, dentist, pharmacy, etc
	
	var placetype = req.params.placetype;
	res.header( 'content-type', 'text/html');	
	req.collection.find( {}, function( err, cursor ) {
		cursor.toArray(function(err, items) {

		res.write('<table>');			
		for(var i = 0; i < items.length; i++){
			res.write( '<tr><td>' + items[i].id + '</td><td><a href="/test/places/'+placetype+'/edit/'+items[i].id+'/"> ' + items[i].name + '</a></td><td>' + items[i].vicinity + '</td></tr>');			
			}
			res.end();
		});
		res.write('</table>');
	});

}

exports.filterPlaces = function( req, res, next ) {
	var input = JSON.parse( req.body.doctorContent );
	
	var myprovider = req.body.provider;
	var placetype = req.params.placetype;
	var ids = input.ids;
	console.log(ids);
	console.log(ids.length);
	res.header( 'content-type', 'application/json' );	
	console.log(myprovider);
	req.overlayCollection.find( {id : {$in: ids} , insurances : myprovider}, function( err, cursor ) {
		cursor.toArray(function(err, items) {
		//res.write('<table>');			
		//for(var i = 0; i < items.length; i++){
			res.send( JSON.stringify( items ) );
		//});
		});
		//res.write('</table>');
	});
	
}

exports.setPlaces = function( req, res, next ) {
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
