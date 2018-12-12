 var express = require('express');
var router = express.Router();
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
var oktaConfig = require('config.json')('./oktaconfig.json');

const oidc = new ExpressOIDC({
  issuer: oktaConfig.oktaAppSettings.issuer,
  client_id: oktaConfig.oktaAppSettings.client_id,
  client_secret: oktaConfig.oktaAppSettings.client_secret,
  redirect_uri: oktaConfig.oktaAppSettings.redirect_uri,
  scope: 'openid profile'
});


console.log(oidc)

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: ' oktaConfig.oktaAppSettings.issuer'
})

const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: oktaConfig.oktaAppSettings.oktaUrl,
  token: oktaConfig.oktaAppSettings.apiToken,    // Obtained from Developer Dashboard
  requestExecutor: new okta.DefaultRequestExecutor() // Will be added by default in 2.0
});

const apiToken = oktaConfig.oktaAppSettings.apiToken
var sendToAccounts = function(amount, id, responseFromMFA){
  var request = require("request");

  var options = { method: 'PUT',
  url: 'https://okta-example-playground.appspot.com/accounts/' + id,
  headers:
  { 'Postman-Token': '965cd78e-ffd6-ad90-0298-a45f52a4be1a',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/x-www-form-urlencoded' },
  form: { requestedAmount: amount } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    responseFromMFA.send(body)
    console.log(body);
  });
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/accountPage', oidc.ensureAuthenticated(), (req, res, next) => {
  console.log(req.userContext.tokens.access_token)
  oktaJwtVerifier.verifyAccessToken(req.userContext.tokens.access_token)
  .catch(jwt => {
    console.log(jwt.parsedBody.factorId)
    res.render('accountPage', { user: req.userContext.userinfo });
  });

});

router.post('/resetMfa', oidc.ensureAuthenticated(), (req, res, next) => {
  var request = require("request");

  var options = { method: 'DELETE',
  url:  oktaConfig.oktaAppSettings + '/api/v1/users/' + req.userContext.userinfo.sub  + '/factors/' + req.userContext.userinfo.smsFactor,
  headers:
  { 'postman-token': '06a11761-4802-fd20-8548-907e852e3083',
  'cache-control': 'no-cache',
  authorization: 'SSWS ' + apiToken,
  'content-type': 'application/json',
  accept: 'application/json' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });


});



router.get('/factors', function(req, res, next) {
  var request = require("request");
  console.log(req.userContext.userinfo)
  var options = { method: 'GET',
  url: oktaConfig.oktaAppSettings + '/api/v1/users/' + req.userContext.userinfo.sub +'/factors',
  headers:
  { 'Postman-Token': '6f68bb39-986c-1757-14a1-472a141b77fe',
  'Cache-Control': 'no-cache',
  Authorization: 'SSWS ' + apiToken,
  'Content-Type': 'application/json',
  Accept: 'application/json' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var factorsResult = JSON.parse(body)
    var smsId = null
    var factors = factorsResult.map(factor =>{
      var oktaFactor = {};
      oktaFactor["id"] = factor.id;
      oktaFactor["type"] = factor.factorType;
      if(factor.factorType == "sms"){
        smsId = factor.id
      }
      return oktaFactor
    });

    if(smsId){
      client.getUser(req.userContext.userinfo.sub)
      .then(user => {
        console.log(user);
        user.profile.factorId = smsId;
        user.update().then(user => {
          res.send(factors);
        });
      });
    } else {
      res.send(factors);
    }
  });
});


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});




router.post('/factorsTest', oidc.ensureAuthenticated(), (req, res, next) => {
  var request = require("request");
  console.log("test")
  console.log(req.body)
  var smsCode = {"passCode": req.body.passCode }

  oktaJwtVerifier.verifyAccessToken(req.userContext.tokens.access_token)
  .catch(jwt => {
    console.log(jwt.parsedBody.factorId)
    var url = oktaConfig.oktaAppSettings + '/api/v1/users/' + req.userContext.userinfo.sub + '/factors/' + jwt.parsedBody.factorId + '/verify'
    console.log(url)
    var options = { method: 'POST',
    url: url,
    headers:
    { 'Postman-Token': '22423508-224d-95be-aa21-2006f0b9162c',
    'Cache-Control': 'no-cache',
    Authorization: 'SSWS ' + apiToken,
    'Content-Type': 'application/json',
    Accept: 'application/json' },
    body: smsCode,
    json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body.factorResult)
      if(body.factorResult == "SUCCESS"){
        sendToAccounts(req.body.requestedAmount, req.body.id, res)
      } else {
        res.send(body)
      }
    });
  });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Express' });
});


router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Express' });
});


router.get('/widget', function(req, res, next) {
  res.render('single', { title: 'Express' });
});

router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', { title: 'Express' });
});

router.get('/single', function(req, res, next) {
  res.render('single', { title: 'Express' });
});


router.get('/blog', function(req, res, next) {
  res.render('blog_row_style3', { title: 'Express' });
});




module.exports = router;
