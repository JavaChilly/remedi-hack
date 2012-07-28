/*!
 * config abstraction
 */

var myName = process.env.NODE_ENV;
if ( myName ) {
	var myConfig = require( "../config/" + myName );
	module.exports = myConfig;
}
