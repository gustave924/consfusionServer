var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');


var config = require('./config');
var authenticate = require('./authenticate');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require("./routes/dishRouter");
var leadersRouter = require("./routes/leadersRouter");
var promotionsRouter = require("./routes/promotionsRouter");

var app = express();
//app.use(cookieParser('1@Ok191097#CalmDown#1989#GuStave#924'));
const url = config.mongoUrl



app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all("*", (req, res, next) => {
    if(req.secure){
        return next();
    }else{
        res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
});



app.use('/dishes', dishRouter);
app.use('/promotions', promotionsRouter);
app.use('/leaders', leadersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
