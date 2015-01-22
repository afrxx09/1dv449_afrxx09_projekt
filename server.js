var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var expressLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');

var mongodbString = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/beer';
var port = process.env.PORT || 5000;
var app = express();

process.on('uncaughtException', function(err) {
    console.log(err);
});

mongoose.connect(mongodbString, function (err, res) {
	if(err) console.log ('ERROR connecting to: ' + mongodbString + '. ' + err);
	else console.log ('Succeeded connected to: ' + mongodbString);
});

require('./config/passport_config')(passport);

app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'afrxx09secretbeerstashappsecrethash' }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(flash());

require('./routes.js')(app, passport);

app.listen(port);
console.log('Server started on port: ' + port);