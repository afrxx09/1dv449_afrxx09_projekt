var flickrCFG = require('../config/flickr_cfg.js');
var key = process.env.BREWERYDB_API_KEY || flickrCFG.api_key;
var secret = process.env.BREWERYDB_API_KEY || flickrCFG.api_secret;
var https = require('https');
//var Flickr = require("flickrapi");
//var flickrOptions = { api_key: key, secret: secret };

exports.search = function(searchString, callback){
	var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + key + '&format=json&text=' + searchString + '&per_page=5&nojsoncallback=1';
	https.get(url, function(res) {
		res.on('data', function(d) {
			var jsonData = JSON.parse(d);
			callback(null, jsonData);
		});
	}).on('error', function(e) {
		callback(new Error("Error contacting flickr"))
	});
	/*
	Flickr.tokenOnly(flickrOptions, function(error, flickr) {
		flickr.photos.search({
			text : searchString,
			page: 1,
			per_page: 5
		}, function(err, result){
			if(err) callback(err);
			callback(null, result);
		});
	});
	*/
};