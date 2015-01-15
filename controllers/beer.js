var Beer = require('../models/beer');

exports.postBeers = function(req, res){
	var beer = new Beer();
	beer.name = req.body.name;
	beer.type = req.body.type;
	beer.quantity = req.body.quantity;
	beer.userId = req.user._id;
	beer.save(function(err){
		if(err) res.send(err);
		res.json({message: 'Beer saved!', data: beer});
	});
}

exports.getBeers = function(req, res){
	Beer.find({userId: req.user._id}, function(err, beers){
		if(err) res.send(err);
		res.send(beers);
	});
};

exports.getBeer = function(req, res){
	Beer.find({userId: req.user._id, _id: req.params.beer_id}, function(err, beer){
		if(err) res.send(err);
		res.json(beer);
	});
};

exports.putBeer = function(req, res){
	Beer.update({userId: req.user._id, _id: req.params.beer_id}, {quantity: req.body.quantity}, function(err, num, raw){
		res.json({message: num + ' updated.'});
	});
};

exports.deleteBeer = function(req, res){
	Beer.remove({userId: req.user._id, _id: req.params.beer_id}, function(err){
		if(err)	res.send(err);
		res.json({message: 'Beer removed!'});
	})
};

exports.search = function(req, res){
	Beer.find({ name : {$regex: req.body.beerSearch, $options: 'i' } }, function(err, r){
		if(err) console.log(err);
		r = (r.length > 0) ? r : null;
        res.render('beersearch', {beers : r, 'searchString' : req.body.beerSearch});
	});
}

exports.searchResults = function(req, res){
	res.render('beersearch', {beers: null, 'searchString' : null});
}