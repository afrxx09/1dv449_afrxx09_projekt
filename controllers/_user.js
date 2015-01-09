var User = require('../models/user');

exports.postUsers = function(req, res){
	var user = new User({
		username: req.body.username,
		password: req.body.password
	});
	user.save(function(err, user){
		if(err){
			res.send(err);
		}
		res.json({message: 'User added!'});
	});
};

exports.getUsers = function(req, res){
	User.find(function(err, users){
		if(err){
			res.send(err);
		}
		res.json(users);
	});
};

exports.getUser = function(req, res){
	User.findOne({_id: req.user._id}, function(err, user){
		if(err) res.send(err);
		res.json(user);
	});
};

exports.putUser = function(req, res){
	User.update({_id: req.user._id}, {username: req.body.username}, function(err, num, raw){
		res.json({message: num + ' updated.'});
	});
};