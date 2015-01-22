var Beer = require('../models/beer');
var brewerydb = require('../webservices/brewerydb');
var flickr = require('../webservices/flickr');

exports.search = function(req, res){
	var searchString = req.query.beer_search;
	var extenalSearch = (req.query.extend == 'true') ? true : false;
	if(!searchString) res.render('search', { beers : [], beer_search : '' });
	
	Beer.find({ name : {$regex: searchString, $options: 'i' } }, function(err, beers){
		if(err) res.render('search', { beers : [], beer_search : searchString });
		else if(!extenalSearch){
			res.render('search', { beers : beers, beer_search : searchString });
		}
		else{
			brewerydb.search(searchString, function(err, brewery_db_result){
				if(err) console.log(err);
				res.render('search', { beers : brewery_db_result, beer_search : searchString });
			});
		}
	});
}

exports.show = function(req, res){
	Beer.findOne({_id: req.params.beer_id}, function(err, beer){
		if(err) res.redirect('/search');
		if(err) res.render('beer', { 'beer' : beer, flickrPhotos : [] });
		else{
			var flickrPhotos = [];
			if(!beer.labels.medium){
				flickr.search(beer.brewery.name, function(err, result){
					for(var i = 0; i < result.photos.photo.length; i++){
						var p = result.photos.photo[i];
						var url = 'https://farm' + p.farm + '.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '.jpg';
						flickrPhotos.push(url);
					}
					res.render('beer', { 'beer' : beer, flickrPhotos : flickrPhotos });
				});
			}
			else{
				res.render('beer', { 'beer' : beer, flickrPhotos : flickrPhotos });
			}
		}
	});
}