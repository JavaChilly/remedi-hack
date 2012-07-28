var express = require( 'express' ),
	config	= require( './lib/config' ),
	db		= require( './lib/db' ),
	logger  = require( './lib/logger' ),
    routes  = {
		search : require( './routes/search' )
	};

var DEBUG   = true;

var app = express.createServer( express.logger() );

var dbInstance = null;

app.configure(function() {
	app.set( 'view engine', 'ejs' );
	app.set( 'views', __dirname + '/views' );
	app.set( 'debugging', DEBUG );
	
	app.use( express.logger() );
	app.use( express.static( __dirname + '/public' ) );
	//app.use( express.cookieParser() );
	app.use( express.bodyParser() );
	app.use( app.router );
	
	// hardcoded db instance reference
	dbInstance = db.connect( config.mongo );
	dbInstance.open( function( err ) { 
		if ( err ) {
			logger.info( 'fatal err on start up', err );
		} else {
			var port = config.node.port || 5000;
		    app.set( 'db', dbInstance );
			app.listen( port, function() {
			  logger.info( "Listening on " + port );
			});
		}
	});
});
app.param( 
	'environment',
	function( req, res, next, environment ) {
		// in the future, you can specify different environments, for now we're hardcoded
		req.db = dbInstance;
		return next();
	}
);
app.param(
	'placetype',
	function( req, res, next, placetype ) {
		req.db.collection( 
			placetype, 
			function( err, collection ) {
				// If collection not found, throw error.
				if ( err ) return next( err );
				// Append collection to request object.
				req.collection = collection;
				// Continue to next handler.
				return next();
			}
		);
	}
);

var testFunc = function( req, res, next) { console.log(req.body); next(); };

app.get( '/:environment/places/:placetype/', routes.search.getPlaces );
app.post( '/:environment/places/:placetype/', testFunc, routes.search.setPlaces );

