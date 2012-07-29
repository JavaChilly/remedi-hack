
var exports = module.exports;

exports.list = function( req, res, next ) {
	res.json( {
		accounts: [
			{
				type: 'Medical',
				provider: 'Aetna'
			},
			{
				type: 'Dental',
				provider: 'Blue Cross, CA'
			}
		]
	});
};
