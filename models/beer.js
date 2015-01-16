var mongoose = require('mongoose');

var BeerSchema = new mongoose.Schema({
	brewerydb_id : {
		type: String,
		index: true
	},
	name : {
		type: String,
		index: true
	},
	description: String,
	style: String,
	ibu: String,
	abv: String,
	labels: {
		large : String,
		medium : String,
		icon : String
	}
});

module.exports = mongoose.model('Beer', BeerSchema);