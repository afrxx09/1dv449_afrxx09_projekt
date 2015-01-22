var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserBeerSchema = new mongoose.Schema({
	user : { type: Schema.Types.ObjectId, ref: 'User' },
	beer : { type: Schema.Types.ObjectId, ref: 'Beer' },
	quantity : Number
});

module.exports = mongoose.model('UserBeer', UserBeerSchema);