var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost:27017/beer';

mongoose.connect(uristring);
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.set('view engine', 'ejs');


var staticRouter = express.Router();
staticRouter.use(function(req, res, next) {
    console.log(req.method, req.url);
    next(); 
});
staticRouter.get('/', function(req, res){
	res.render('index');
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



app.listen(3000);
console.log('Server started on port: ' + 3000);