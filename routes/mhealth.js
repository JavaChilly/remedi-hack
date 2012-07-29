var https = require('https'),
    qs   = require('querystring');

var exports = module.exports;

var mhealthAppName      = 'remedi';
var mhealthClientSecret = 'HQy10qHM2nGEc6Sc6ncO7qsh7tvaWWtUEEEwB6E7';
var mhealthRedirect     = 'http://localhost:8200/mhealthCallback/';
var postloginRedirect   = 'http://myremedi.weebly.com/accounts.html';

//var mhealthAuthURL = "https://" + mhealthAppName + ":" + mhealthClientSecret + "@mhealth.att.com/access_token.json";

exports.loginCallback = function( req, res, next ) {
	var body = qs.stringify({
		'grant_type'   : 'authorization_code',
		'code'         : req.query.code,
		'redirect_uri' : mhealthRedirect
	});
	
	console.log('posted body=' + body);
	
	var reqOptions = {
		auth: "" + mhealthAppName + ":" + mhealthClientSecret,
		hostname: "mhealth.att.com",
		path: "/access_token.json",
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		    'Content-Length': body.length
		}
	};
	
	console.log('options');
	console.log(reqOptions);
	
	var mhealthRequest = https.request( reqOptions, function( mHealthResponse ) {
		console.log( mHealthResponse );
		mHealthResponse.setEncoding('utf8');
		mHealthResponse.on('data', function (chunk) {
			console.log('Response: ' + chunk);
			res.redirect(postloginRedirect);
		});
	});
	
	mhealthRequest.write(body);
	mhealthRequest.end();
};