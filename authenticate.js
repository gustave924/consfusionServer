const passport = require('passport');
const LocalStrategry = require('passport-local').Strategy
const User = require('./models/user');

exports.local = passport.use(new LocalStrategry(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())