var User = require('../models/user');

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
	process.nextTick(function(){
		User.findOne({_id: req.user._id}, function(err, user){
			if(err) res.send(err);
			if(!user) res.send(null, false);
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.save(function(err){
				if(err){
                    for(var error in err.errors){
                        req.flash('loginMessage', err.errors[error].message);
                    }
                }
				res.redirect('./profile');
			});
		});
	});
};

exports.signupForm = function(req, res){
	res.render('signup', { message : req.flash('loginMessage') });
};