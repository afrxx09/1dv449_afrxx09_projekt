var User = require('../models/user');

exports.getProfile = function(req, res){
	User.findOne({_id: req.user._id}, function(err, user){
		if(err) res.send(err);
		res.render('profile');
	});
};

exports.saveProfile = function(req, res){
	User.findOne({_id: req.user._id}, function(err, user){
		if(err) res.send(err);
		if(!user) res.send(null, false);
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.save(function(err){
			if(err)  res.send(err)
			res.render('profile');
		});
	});
};

exports.signup = function(req, res, next, passport){
	passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup'
	})
};

exports.signupForm = function(req, res){
	res.render('signup', { message : req.flash('loginMessage') });
};