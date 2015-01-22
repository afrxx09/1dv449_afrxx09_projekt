var BreweryDb = require('brewerydb-node');
var breweryDbCFG = require('../config/brewery_db_cfg.js');
var api_key = process.env.BREWERYDB_API_KEY || breweryDbCFG.api_key;
var brewdb = new BreweryDb(api_key);
var Beer = require('../models/beer');
var fs = require('fs');

var Webservice = {
	search : function(beer_search, callback){
		brewdb.search.beers({ q: beer_search, type: 'beer', withBreweries : 'Y' }, function(err, data){
			if(err || !data ) return callback(err);
			
			var beers = [], newBeer = null;
			for(var i = 0; i < data.length; i++){
				newBeer = new Beer();
				newBeer.brewerydb_id = data[i].id;
				newBeer.name = data[i].name;
				newBeer.style = (data[i].style) ? ( (data[i].style.name) ? data[i].style.name : ( (data[i].style.category.name) ? data[i].style.category.name : '' ) ) : ''; 
				newBeer.description = data[i].description;
				newBeer.ibu = data[i].ibu;
				newBeer.abv = data[i].abv;
				newBeer.labels.small = (data[i].labels && data[i].labels.icon) ? data[i].labels.icon : '';
				newBeer.labels.medium = (data[i].labels && data[i].labels.medium) ? data[i].labels.medium : '';
				newBeer.labels.large = (data[i].labels && data[i].labels.large) ? data[i].labels.large : '';
				if(data[i].breweries && data[i].breweries.length > 0){
					newBeer.brewery.brewerydb_id = data[i].breweries[0].id;
					newBeer.brewery.name = data[i].breweries[0].name;
					newBeer.brewery.website = data[i].breweries[0].website;
				}
				newBeer.save(function(err){
					if(err) console.log(err);
					beers.push(newBeer);
				});
			}
			callback(null, beers);
		});
	}
}

module.exports = Webservice;