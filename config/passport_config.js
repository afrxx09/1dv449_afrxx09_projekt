var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleCFG = require('./google_cfg.js');
var User = require('../models/user');

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
            User.findOne({'local.email':  email}, function(err, existingUser){
                if(err) return done(err);
                if(req.body.password_confirm !== password) return done(null, false, req.flash('loginMessage', 'Password does not match.'));
                if(existingUser) return done(null, false, req.flash('loginMessage', 'User already exists.'));
                if(req.user){
                    user = req.user;
                    user.local.email = email;
                    user.local.password = user.generateHash(password);
                    user.save(function(err){
                        if(err){
                            for(var error in err.errors){
                                req.flash('loginMessage', err.errors[error].message);
                            }
                            return done(null, false);
                        }
                        return done(null, user);
                    });
                }
                else{
                    var newUser = new User();
                    newUser.firstName = req.body.firstName;
                    newUser.lastName = req.body.lastName;
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err){
                        if(err){
                            for(var error in err.errors){
                                req.flash('loginMessage', err.errors[error].message);
                            }
                            return done(null, false);
                        }
                        return done(null, newUser);
                    });
                }
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
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'User does not exsist.'));
            if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong password.'));
            return done(null, user);
        });

    }));

    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID || googleCFG.clientID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET || googleCFG.clientSecret,
        callbackURL : process.env.GOOGLE_CLIENT_CB || googleCFG.callbackURL,
        passReqToCallback : true
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if(!req.user){
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if(err) return done(err);
                    if(user){
                        if(!user.google.token){
                            user.google.id = profile.id;
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = profile.emails[0].value;
                            user.save(function(err){
                                if(err){
                                    for(var error in err.errors){
                                        req.flash('loginMessage', err.errors[error].message);
                                    }
                                    return done(null, false);
                                }
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                    } 
                    else{
                        var newUser = new User();
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if(err){
                                for(var error in err.errors){
                                    req.flash('loginMessage', err.errors[error].message);
                                }
                                return done(null, false);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            }
            else{
                var user = req.user;
                user.google.id = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email = profile.emails[0].value;

                user.save(function(err) {
                    if(err){
                        for(var error in err.errors){
                            req.flash('loginMessage', err.errors[error].message);
                        }
                        return done(null, false);
                    }
                    return done(null, user);
                });
            }
        });
    }));
};