const passport = require('passport');
const LocalStrategry = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config')
const User = require('./models/user');

exports.local = passport.use(new LocalStrategry(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwtPayload, done) => {
        User.findOne({_id: jwtPayload._id}, (err, user) => {
            if(err){
                return done(err, false);
            }else if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.isAdmin){
        next()
    }else{
       err = new Error("You are not authorized to perform this operation!");
       err.status = 403;
       next(err);
    }
};

