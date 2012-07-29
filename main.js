var express = require( 'express' ),
	config	= require( './lib/config' ),
	db		= require( './lib/db' ),
	logger  = require( './lib/logger' ),
    routes  = {
		search   : require( './routes/search' ),
		edit     : require( './routes/edit' ),
		accounts : require( './routes/accounts' ),
		mhealth  : require( './routes/mhealth' )
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
	
	app.use( logger.logInternalError );
	
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
				
				var overlayName = "" + placetype + "_overlay";
				
				req.db.collection(
					overlayName,
					function( err, overlayCollection ) {
						if ( err ) return next( err );
						req.overlayCollection = overlayCollection;
						return next();
					}
				);
			}
		);
	}
);

var testFunc = function( req, res, next) { /*console.log(req.body);*/ next(); };

app.get( '/mhealthCallback/', routes.mhealth.loginCallback );
app.get( '/accounts/', routes.accounts.list );

app.get( '/:environment/places/:placetype/list/', routes.search.listPlaces );
app.post( '/:environment/places/:placetype/filter/', routes.search.filterPlaces );
app.get( '/:environment/places/:placetype/', routes.search.getPlaces );
app.post( '/:environment/places/:placetype/', testFunc, routes.search.setPlaces );
app.get( '/:environment/places/:placetype/edit/:id/', routes.edit.showEditor );
app.post( '/:environment/places/:placetype/save/:id/', routes.edit.saveEditor );

