const flash=require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Writer = require('../models/Writer');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  Writer.getWriterByEmail(email, function (err, writer) {
    if (!writer) {
      return done(null, false, {
        message: 'Unknown User'
      });
      
    } else {
      Writer.comparePassword(password, writer.local.password, function (err, isMatch) {
        if (isMatch) {
          return done(null, writer);  
        } else {
          return done(null, false, {
            message: 'Invalid password! Try again'
          });
        }
      });
    }


  });

}));


passport.serializeUser(function (writer, done) {
  done(null, writer.id);
});

passport.deserializeUser(function (id, done) {
  Writer.findById(id, function (err, user) {
    done(err, user);
   
  });
})