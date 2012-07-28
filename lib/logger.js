var config  = require('./config');
	
var logLevels = {
		debug: 0,
		info: 1,
		error: 2,
};

var debugEnabled = true;
if ( config.debugEnabled && config.debugEnabled === 'false' ) {
	debugEnabled = false;
}
	
var instance = {
	// replace this with something more robust for varied messaging
	log: function( type, msg, meta) {
		console.log( msg );
	}
};

var exitOnFatalError = function( err ) {
	return false;
};

var logWrapper = function( type, msg, meta ) {
	if ( meta ) {
		instance.log( type, msg, meta );
	} else {
		instance.log( type, msg );
	}
};

instance.exitOnError = exitOnFatalError;

var exports = module.exports;
exports.log = function( msg, meta ) {
	if ( debugEnabled ) { 
		logWrapper ('debug', msg, meta );
	}
};

exports.debug = function( msg, meta ) {
	if ( debugEnabled ) { logWrapper ('debug', msg, meta ); }
};

exports.info = function( msg, meta ) {
	logWrapper ('info', msg, meta );
};

exports.error = function( msg, meta ) {
	logWrapper ('error', msg, meta );
};

// called by middleware shim to log errors properly
exports.logInternalError = function( err, req, res, next ) {
	logWrapper('error', err.message, err);
	next( err );
};