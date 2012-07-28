/**
 * Include modules.
 */
var	MongoDB   = require('mongodb'),
	logger    = require('./logger');


/**
 * Public methods.
 */
module.exports = {
	connect: function( config ) {

		// If no database setting in config, throw error.
		if ( config.database === undefined ) {
			logger.error( 'DB: database (' + config.database + ') is missing. Check your config.' );
			return;
		}

		var servers = null;
	
		// Check whether this is single instance or replicaset.
		if ( config.replicaSet ) {

			// If replicaset name is not defined, throw error.
			if ( config.replicaSetName === undefined ) {
				logger.error( 'DB: replicaSetName missing from config.mongo, please check your config.' );
				return;
			}

			// Instantiate each of the replicaset servers.
			var replicas = [];
			for ( var i = 0, l = config.replicaSet.length; i < l; i++ ) {
				var server = config.replicaSet[i];
				// If replicaset server is not configured properly, error.
				if ( server.host === undefined || server.port === undefined ) {
					logger.error( 'DB: replica set config missing host or port, please check your config.' );
					return;
				} 
				// Port MUST be a number for MongoDB lib. Throw error otherwise.
				else if ( typeof server.port != 'number' ) {
					logger.error( 'DB: port must be a number, please check your config.' );
					return;
				}
				// Make connection to this server.
				replicas[replicas.length] = new MongoDB.Server( server.host, server.port );
			}
			// Instantiate the replicaset.
			servers = new MongoDB.ReplSetServers( replicas, { rs_name: config.replicaSetName } );
		
		} else {

			// Log an error and exit if host, port or db_name unprovided.
			if ( config.address === undefined || config.port === undefined ) {
				logger.error( 'DB: Address (' + config.address + ') or port (' + config.port + ') are missing. Check your config.' );
				return;
			}

			// Instantiate server from MongoDB module.
			servers = new MongoDB.Server( config.address, config.port );
		}
	
		// Create new database connection.
		return new MongoDB.Db( config.database, servers );
	
	}
};
