var express = require('express');
var beerC = require('./controllers/beer');

module.exports = function(app, passport){
	app.get('*', function(req, res, next) {
		res.locals.user = req.user || null;
		next();
	});

	var staticRouter = express.Router();
	staticRouter.use(function(req, res, next) {
	    console.log(req.method, req.url);
	    next(); 
	});
	staticRouter.get('/', function(req, res){
		res.render('index');
	});
	staticRouter.get('/profile', isLoggedIn, function(req, res){
		res.render('profile');
	});

	staticRouter.get('/login', function(req, res){
		res.render('login');
	});
	staticRouter.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));
	staticRouter.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

	staticRouter.get('/signup', function(req, res){
		res.render('signup');
	});
	staticRouter.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup'
	}));

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	var apiRouter = express.Router();
	apiRouter.use(function(req, res, next) {
	    console.log(req.method, req.url);
	    next(); 
	});
	apiRouter.route('/beers')
		.post(isLoggedIn, beerC.postBeers)
		.get(isLoggedIn, beerC.getBeers);
	apiRouter.route('/beer/:beer_id')
		.get(isLoggedIn, beerC.getBeer)
		.put(isLoggedIn, beerC.putBeer)
		.delete(isLoggedIn, beerC.deleteBeer);

	app.use('/api', apiRouter);
	app.use('/', staticRouter);
	app.use(express.static(__dirname + '/public'));
};

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}