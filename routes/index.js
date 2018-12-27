var express = require('express');
var router = express.Router();
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
var oktaConfig = require('config.json')('./oktaconfig.json');

const oidc = new ExpressOIDC({
  issuer: process.env.ISSUER,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: "https://" + process.env.PROJECT_DOMAIN + ".glitch.me/authorization-code/callback",
  scope: 'openid profile'
});


console.log(oidc)
var oktaTenantUrl = process.env.OKTA_URL


const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.issuer
})

const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: process.env.OKTA_URL,
  token: process.env.OKTA_API_TOKEN,    // Obtained from Developer Dashboard
  requestExecutor: new okta.DefaultRequestExecutor() // Will be added by default in 2.0
});

const apiToken = process.env.OKTA_API_TOKEN;

const assetsUrl = "https://cdn.glitch.com/" + process.env.PROJECT_ID + "%2F"

var sendToAccounts = function(amount, id, responseFromMFA){
  var request = require("request");
  console.log(amount)
  console.log(id)
  var putUrl = 'https://okta-example-playground.appspot.com/accounts/' + id
  console.log(putUrl)
 var options = { method: 'PUT',
  url: putUrl,
  headers: 
   { 'Postman-Token': '0cf3d312-5f64-1eeb-fd94-7f4cd46a60ab',
     'Cache-Control': 'no-cache',
     Authorization: 'SSWS {{apikey}}',
     'Content-Type': 'application/x-www-form-urlencoded',
     Accept: 'application/json' },
  form: { requestedAmount: amount } };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    responseFromMFA.send(body)
    console.log(body);
  });
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', assetsUrl: assetsUrl, user: req.userContext });
});

router.get('/accountPage', oidc.ensureAuthenticated(), (req, res, next) => {
  console.log(req.userContext.tokens.access_token)
  oktaJwtVerifier.verifyAccessToken(req.userContext.tokens.access_token)
  .catch(jwt => {
    console.log(jwt.parsedBody.factorId)
    res.render('accountPage', { user: req.userContext, test: "test",assetsUrl: assetsUrl });
  });

});

router.post('/resetMfa', oidc.ensureAuthenticated(), (req, res, next) => {
  var request = require("request");

  var options = { method: 'DELETE',
  url:  oktaTenantUrl  + '/api/v1/users/' + req.userContext.userinfo.sub  + '/factors/' + req.userContext.userinfo.smsFactor,
  headers:
  { 
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
  url: oktaTenantUrl  + '/api/v1/users/' + req.userContext.userinfo.sub +'/factors',
  headers:
  { 
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
  var bankId = req.body.bankAccount
  var requestedAmount = req.body.requestedAmount
  var smsCode = {"passCode": req.body.passCode }

  oktaJwtVerifier.verifyAccessToken(req.userContext.tokens.access_token)
  .catch(jwt => {
    console.log(jwt.parsedBody.factorId)
    var url = oktaTenantUrl + '/api/v1/users/' + req.userContext.userinfo.sub + '/factors/' + jwt.parsedBody.factorId + '/verify'
    console.log(url)
    var options = { method: 'POST',
    url: url,
    headers:
    {
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
        console.log(req.body.id,)
        console.log(req.body.requestedAmount)
        sendToAccounts(requestedAmount, bankId, res)
      } else {
        res.send(body)
      }
    });
  });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express', assetsUrl: assetsUrl });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express', assetsUrl: assetsUrl });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Express', assetsUrl: assetsUrl });
});


router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Express', assetsUrl: assetsUrl });
});


router.get('/widget', function(req, res, next) {
  res.render('single', { title: 'Express', assetsUrl: assetsUrl });
});

router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', { title: 'Express', assetsUrl: assetsUrl });
});

router.get('/single', function(req, res, next) {
  res.render('single', { title: 'Express', assetsUrl: assetsUrl });
});


router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express', assetsUrl: assetsUrl });
});




module.exports = router;
