var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleCFG = require('./google_cfg.js');
var User = require('./models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            User.findOne({'local.email':  email}, function(err, user){
                if(err)
                    return done(err);
                if(user)
                    return done(null, false);
                var newUser = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err){
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false);
            if (!user.validPassword(password))
                return done(null, false);
            return done(null, user);
        });

    }));

    passport.use(new GoogleStrategy({

        clientID : process.env.GOOGLE_CLIENT_CB || googleCFG.clientID,
        clientSecret : process.env.GOOGLE_CLIENT_CB || googleCFG.clientSecret,
        callbackURL : process.env.GOOGLE_CLIENT_CB || googleCFG.callbackURL,

    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                
                var newUser          = new User();
                newUser.google.id    = profile.id;
                newUser.google.token = token;
                newUser.google.name  = profile.displayName;
                newUser.google.email = profile.emails[0].value;

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            });
        });

    }));

};