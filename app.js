// Preprocessor directives
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./models');
// creating express application
var app = express();

// importing main router for app
var indexRouter = require('./routes/index');

// Syncing imported database with model
db.sequelize.sync();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// main rout for app
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(err.status === 404){
    res.render('page-not-found', { err, title: 'Page Not Found' });
  }else {
		// render the error page
    res.status(err.status || 500);
		res.render('error', { err, title: 'Server Error' });
	}

});

// exporting express app
module.exports = app;
