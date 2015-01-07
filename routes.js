var express = require('express');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

module.exports = function(app){
	var staticRouter = express.Router();
	staticRouter.use(function(req, res, next) {
	    console.log(req.method, req.url);
	    next(); 
	});
	staticRouter.get('/', function(req, res){
		res.render('index');
	});
	staticRouter.get('/login', function(req, res){
		res.render('login');
	});

	var apiRouter = express.Router();
	apiRouter.use(function(req, res, next) {
	    console.log(req.method, req.url);
	    next(); 
	});
	apiRouter.route('/beers')
		.post(authController.isAuthenticated, beerController.postBeers)
		.get(authController.isAuthenticated, beerController.getBeers);
	apiRouter.route('/beer/:beer_id')
		.get(authController.isAuthenticated, beerController.getBeer)
		.put(authController.isAuthenticated, beerController.putBeer)
		.delete(authController.isAuthenticated, beerController.deleteBeer);

	apiRouter.route('/users')
		.post(userController.postUsers)
		.get(authController.isAuthenticated, userController.getUsers);

	app.use('/api', apiRouter);
	app.use('/', staticRouter);
	app.use(express.static(__dirname + '/public'));
};