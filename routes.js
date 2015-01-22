var express = require('express');
var beerC = require('./controllers/beer');
var userC = require('./controllers/user');
var brewerydbC = require('./webservices/brewerydb');
var userBeer = require('./models/user_beer');

module.exports = function(app, passport){
	app.get('*', function(req, res, next) {
		res.locals.user = req.user || null;
		next();
	});
	app.post('*', function(req, res, next) {
		res.locals.user = req.user || null;
		next();
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
		failureRedirect : '/login',
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
				if(err) res.render('index', { beer_search : null, 'stash' : [] });
				else{
					res.render('index', { beer_search : null, 'stash' : stash });
				}
			});
		}
		else{
			res.render('index', { beer_search : null, 'stash' : [] });
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
		.get(function(req, res){ res.render('login', {message : req.flash('loginMessage')}); })
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
	//router.route('/friends').get(isLoggedIn, userC.friends);
	
	router.route('/beer/:beer_id').get(isLoggedIn, beerC.show);
	
	/*
	var apiRouter = express.Router();
	apiRouter.route('/beers')
		.post(isLoggedIn, beerC.postBeers)
		.get(isLoggedIn, beerC.getBeers);
	apiRouter.route('/beer/:beer_id')
		.get(isLoggedIn, beerC.getBeer)
		.put(isLoggedIn, beerC.putBeer)
		.delete(isLoggedIn, beerC.deleteBeer);
	*/
	app.use('/', router);
	//app.use('/api', apiRouter);
	app.use(express.static(__dirname + '/public'));
};

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}