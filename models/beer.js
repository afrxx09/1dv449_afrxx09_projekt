var mongoose = require('mongoose');

var BeerSchema = new mongoose.Schema({
	brewerydb_id : {
		type : String,
		index : { unique: true }
	},
	name : {
		type : String,
		index : true
	},
	description : String,
	style : String,
	ibu : String,
	abv : String,
	labels : {
		large : String,
		medium : String,
		small : String
	},
	brewery : { 
		brewerydb_id : String,
		name : String,
		website : String
	}
});

module.exports = mongoose.model('Beer', BeerSchema);