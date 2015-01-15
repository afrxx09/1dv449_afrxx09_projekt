var mongoose = require('mongoose');

var BeerSchema = new mongoose.Schema({
	brewerydb_id : String,
	name: String,
	description: String,
	style: String,
	ibu: String,
	abv: String,
	quantity: Number
});

module.exports = mongoose.model('Beer', BeerSchema);