var express = require('express');
var beerC = require('./controllers/beer');
var userC = require('./controllers/user');
var brewerydbC = require('./webservices/brewerydb');
var userBeer = require('./models/user_beer');

module.exports = function(app, passport){
	
	app.get("/cache.manifest", function(req, res){
		res.header('Content-Type', 'text/cache-manifest');
		res.Header('Cache-Control', 'public, max-age=0');
		res.Header('ExpiresActive', 'On');
		res.Header('ExpiresDefault', 'access');
		res.send();
	});
	
	app.get('*', function(req, res, next) {
		//res.setHeader('Cache-Control', 'public, max-age=31557600');
		res.locals.user = req.user || null;
		next();
	});
	
	app.post('*', function(req, res, next) {
		res.locals.user = req.user || null;
		next();
	});
	
	app.get('/offlinecheck', function(req, res){
		res.status(200).send();
	});
	
	app.get('/unlink/local', isLoggedIn, function(req, res){
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function(err){
            res.redirect('/profile');
		});
	});
	app.get('/unlink/google', isLoggedIn, function(req, res){
		var user = req.user;
		user.google.token = undefined;
		user.save(function(err){
            res.redirect('/profile');
		});
	});
	app.get('/connect/local', isLoggedIn, function(req, res){
		res.render('connect_local', { message: req.flash('loginMessage')});
	});
	app.post('/connect/local', isLoggedIn, passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		falureFlash: true
	}));
	app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
	app.get('/connect/google/callback', passport.authorize('google', {
		successRedirect : '/profile',
		failureRedirect : '/',
		falureFlash: true
	}));
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect : '/',
		failureRedirect : '/login',
		falureFlash: true
	}));

	var router = express.Router();
	router.route('/').get(function(req, res){
		if(req.user){
			userBeer.find({user : req.user._id}).populate('beer').exec(function(err, stash){
				if(err) res.render('index', { beer_search : null, 'stash' : [], message : req.flash('loginMessage') });
				else{
					res.render('index', { beer_search : null, 'stash' : stash, message : req.flash('loginMessage') });
				}
			});
		}
		else{
			res.render('index', { beer_search : null, 'stash' : [], message : req.flash('loginMessage') });
		}
	});
	router.route('/profile')
		.get(isLoggedIn, userC.getProfile)
		.post(isLoggedIn, userC.saveProfile);
	router.route('/signup')
		.get(userC.signupForm)
		.post(passport.authenticate('local-signup', {
			successRedirect: '/',
			failureRedirect: '/signup',
			falureFlash: true
		}));
	router.route('/login')
		.get(function(req, res){
			res.render('login', {message : req.flash('loginMessage')});
		})
		.post(passport.authenticate('local-login', {
			successRedirect : '/',
			failureRedirect : '/login',
			falureFlash: true
		}));
	router.route('/logout').get(function(req, res) { req.logout(); res.redirect('/'); });

	router.route('/search').get(isLoggedIn, beerC.search);
	router.route('/addtostash/:beer_id').post(isLoggedIn, userC.addBeerToStash);
	router.route('/updateuserstash').post(isLoggedIn, function(req, res){
		userBeer.findOne({_id: req.body.id}, function(err, ub){
			if(err) res.status(500).send();
			ub.quantity = (req.body.a == 'inc') ? ub.quantity + 1 : ub.quantity - 1;
			ub.save(function(err){
				if(err) res.status(500).send();
				res.json({newValue : ub.quantity});
			});
		});
	});
	router.route('/deletefromuserstash').post(isLoggedIn, function(req, res){
		userBeer.remove({_id : req.body.id}, function(err){
			if(err) res.status(500).send();
			res.json({a : 'b'});
		});
	});
	
	router.route('/beer/:beer_id').get(isLoggedIn, beerC.show);
	
	app.use('/', router);
	app.use(express.static(__dirname + '/public'));
};

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}