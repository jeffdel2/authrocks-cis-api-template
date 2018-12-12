var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var oktaConfig = require('config.json')('./oktaconfig.json');

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const oidc = new ExpressOIDC({
  issuer: oktaConfig.oktaAppSettings.issuer,
  client_id: oktaConfig.oktaAppSettings.client_id,
  client_secret: oktaConfig.oktaAppSettings.client_secret,
  redirect_uri: oktaConfig.oktaAppSettings.redirect_uri,
  scope: 'openid profile'
});


// session support is required to use ExpressOIDC
app.use(session({
  secret: 'this should be secure',
  resave: true,
  saveUninitialized: false
}));




// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
