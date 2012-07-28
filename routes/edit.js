var logger = require("../lib/logger");

var exports = module.exports;

var showEditor = function(req, res, record, overlayRecord) {
	
	if (req.params.placetype != "doctor") {
		return res.send("unexpected placetype");
	}
	
	res.locals.record = record;
	res.locals.overlayRecord = overlayRecord;
	res.render("editor_doctor", { record: record });
	res.end();
}

var linesToArray = function(stringVal) {
	if (stringVal == null) {
		stringVal = '';
	}
	return stringVal.split("\n");
}

exports.showEditor = function( req, res, next ) {
	var id = req.params.id;
	var placetype = req.params.placetype;
	
	req.collection.findOne( { id : id }, function( err, standardRecord ) {
		if ( err ) { logger.info( ' failed to find record by ID '); res.send("unknown ID"); }
		
		req.overlayCollection.findOne( { id : id }, function( err, overlayRecord ) {
			showEditor( req, res, standardRecord, overlayRecord );
		});
	});
}

exports.saveEditor = function( req, res, next ) {
	
	var overlayRecord = {
		id : req.params.id,
		insurances  : linesToArray(req.body.insurances),
		specialties : linesToArray(req.body.specialties),
		languages   : linesToArray(req.body.languages),
		affiliation : req.body.affiliation ? req.body.affiliation : '',
		acceptingNew   : req.body.accepting_new ? true : false,
		boardCertified : req.body.board_certified ? true : false,
		gender         : req.body.gender
	};
	
	req.collection.findOne( { id : overlayRecord.id }, function( err, standardRecord ) {
		if ( err ) { logger.info( ' failed to find record by ID '); return res.send("unknown ID"); }
	
		req.overlayCollection.update( { id : overlayRecord.id }, overlayRecord, {safe : true, upsert: true}, function( err ) {
			if ( err ) { return next( err ); }
			res.redirect("/" + req.params.environment + "/places/" + req.params.placetype + "/list/");
		});
	});
}