var BreweryDb = require('brewerydb-node');
var breweryDbCFG = require('../brewery_db_cfg.js');
var api_key = process.env.BREWERYDB_API_KEY || breweryDbCFG.api_key;
var brewdb = new BreweryDb(api_key);
var Beer = require('../models/beer');

exports.search = function(req, res){
	var b = [];
	brewdb.search.beers({ q: req.params.searchString }, function(err, data){
		if(err) console.log(err);
		if(!data){
			console.log('no result');
		}
		if(data){
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
					b.push(newBeer);
				});
			}
		}
		res.render('beersearch', {beers : b, 'searchString' : req.body.beerSearch});
		
	});
}