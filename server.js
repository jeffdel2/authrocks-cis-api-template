#!/usr/bin/env node

/**
 * Module dependencies.
 */
var envFileEmpty = false;
if(!process.env.CLIENT_ID) {
  console.log(".env is empty");
  envFileEmpty = true;
  process.env.CLIENT_ID = "empty";
  process.env.CLIENT_SECRET = "empty";
  process.env.ISSUER = "https://example.okta.com";
  process.env.OKTA_URL = "https://example.okta.com";
}

var debug = require('debug')('bankinguiapp:server');
var http = require('http');

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
const assetsUrl = "https://cdn.glitch.com/" + process.env.PROJECT_ID + "%2F"

const oidc = new ExpressOIDC({
  issuer: process.env.ISSUER,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: "https://" + process.env.PROJECT_DOMAIN + ".glitch.me/authorization-code/callback",
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

app.get("/*", function (req, res, next) {

  if(envFileEmpty) {
    // FIXME: Flush this out to give better debugging information
    //        Perhaps using our own res.render() call here with a template?
    res.render('noEnv', { title: 'Express', assetsUrl: assetsUrl });
  } else {
    next();
  }
});
app.get("/noEnv", function (req, res, next) {
    // https://glitch.com/edit/#!/avbank?path=.env:1:0
    var envEditLink = "https://glitch.com/edit/#!/" + process.env.PROJECT_DOMAIN + "?path=.env:1:0";
    res.render('noEnv', { title: 'Express', assetsUrl: assetsUrl, envEditLink: envEditLink });
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
/***
app.use(function(req, res, next) {
  console.log("404 caught");
  next(createError(404));
});
*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/****
// Handle errors
app.use((err, req, res, next) => {
    if (! err) {
        return next();
    }

    res.status(500);
    res.send('500: Internal server error');
});
/* */

module.exports = app;



/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

oidc.on('ready', () => {
  console.log("OIDC Ready");

  server.listen(port);
  //  server.on('error', onError);
  server.on('listening', onListening);
});

oidc.on('error', err => {
  console.log("OIDC ERROR");
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.log("onError called");
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
