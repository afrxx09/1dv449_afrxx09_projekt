var BreweryDb = require('brewerydb-node');
var breweryDbCFG = require('../config/brewery_db_cfg.js');
var api_key = process.env.BREWERYDB_API_KEY || breweryDbCFG.api_key;
var brewdb = new BreweryDb(api_key);
var Beer = require('../models/beer');
var fs = require('fs');

exports.search = function(beer_search){
	brewdb.search.beers({ q: beer_search, type: 'beer', withBreweries : 'Y' }, function(err, data){
		console.log(typeof data);
		console.log(data);
		fs.writeFile('asd.json', JSON.stringify(data), function(err){
			if(err) console.log('not saved...');
			else console.log('file saved.');
			return null;
		});
		/*
		var beers = null;
		if(err) console.log(err);
		if(!data){
			return beers;
		}
		if(data){
			beers = [];
			for(var i = 0; i < data.length; i++){
				var newBeer = new Beer();
				newBeer.brewerydb_id = data[i].id;
				newBeer.name = data[i].name;
				newBeer.style = data[i].style.name;
				newBeer.description = data[i].description;
				newBeer.ibu = data[i].ibu;
				newBeer.abv = data[i].id;
				newBeer.save(function(err){
					if(err) console.log(err);
					else beers.push(newBeer);
				});
			}
		}
		return beers;
		*/
	});
}