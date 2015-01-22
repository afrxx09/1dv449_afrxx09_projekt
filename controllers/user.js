var User = require('../models/user');
var Beer = require('../models/beer');
var UserBeer = require('../models/user_beer');

exports.getProfile = function(req, res){
	User.findOne({_id: req.user._id}, function(err, user){
		if(err){
            for(var error in err.errors){
                req.flash('loginMessage', err.errors[error].message);
            }
        }
		res.render('profile', { message: req.flash('loginMessage')});
	});
};

exports.saveProfile = function(req, res){
	User.findOne({_id: req.user._id}, function(err, user){
		if(err) res.send(err);
		if(!user) res.send(null, false);
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.city = req.body.city;
		user.country = req.body.country;
		user.save(function(err){
			if(err){
                for(var error in err.errors){
                    req.flash('loginMessage', err.errors[error].message);
                }
            }
			res.redirect('/profile');
		});
	});
};

exports.signupForm = function(req, res){
	res.render('signup', { message : req.flash('loginMessage') });
};

exports.addBeerToStash = function(req, res){
	User.findOne({_id: req.user._id}, function(err, user){
		Beer.findOne({_id: req.params.beer_id}, function(err, beer){
			var userBeer = new UserBeer();
			userBeer.user = user;
			userBeer.beer = beer;
			userBeer.quantity = req.body.quantity;
			userBeer.save(function(err){
				if(err) console.log(err);
				else{
					user.userBeers.push(userBeer);
					user.save(function(err){
						if(err) console.log(err);
						res.redirect('/');
					});
				}
			});
		});
	});
}

/*
exports.friends = function(req, res){
	var searchString = req.query.friend_search;
	User.findOne({_id: req.user._id}).populate('friends').exec(function(err, user){
		if(err) res.redirect('/');
		if(!searchString){
			res.render('friends', { 'user' : user, 'users' : [], 'friend_search' : '' });
		}
		else{
			User.find({
				$or : [
					{ firstName : { $regex: searchString, $options: 'i' } },
					{ lastName : { $regex: searchString, $options: 'i' } }
				],
				_id : { $ne : req.user._id}
			}, function(err, users){
				if(err) res.render('friends', { 'user' : user, 'users' : [], 'friend_search' : searchString });
				res.render('friends', { 'user' : user, 'users' : users, 'friend_search' : searchString });
			});
		}
	});
}
*/