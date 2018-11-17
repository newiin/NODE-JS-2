const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');

passport.use(new GoogleStrategy({
        // google start options
        clientID: '5462552121212392084639-9tbbiqjirf5zvbnvnmbm,sf99tl0n10b41j9p0uv0i.apps.googleusercontent.com',
        clientSecret: '4fI7qTR4dz5ccncncftzBvSPmg9qmm',
        callbackURL: "/google/auth/redirect"
    },
    function (accessToken, refreshToken, profile, done) {
        // check if user exist in the database
        User.findOne({'google.id':profile.id}).then((googleUserFound) => {
            if (googleUserFound) {
                done(null,googleUserFound)
                
            } else {
                new User({
                    'google.email': profile.emails[0].value,
                    'google.id': profile.id,
                    'google.name': profile.displayName,
                    'google.token': accessToken
        
                }).save().then(newGoogleUser => {
                    done(null,newGoogleUser)
        
                }).catch((err) => {
                    console.log(err);
        
                });
                
            }
        }).catch((err) => {
            console.log(err);
            
        })

        passport.serializeUser(function (user, done) {
            done(null, user.id);
          });
          
          passport.deserializeUser(function (id, done) {
            User.findById(id, function (err, user) {
              done(err, user); 
            });
          })


    }
));
