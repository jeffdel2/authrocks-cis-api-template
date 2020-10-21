const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const endpointHandlers = require('./endpointHandlers.js');
const webHookHandlers = require('./webHookHandlers.js');
const config = require('./endpointHandlers.js');
const app = express();
const port = 3000;

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: config.okta.OKTA_ISSUER,
  clientId: config.okta.OKTA_CLIENT_ID
});


app.get('/', (req, res) => {
  res.send('This is the Fun Auth API');
});


app.get('/api/public', (req, res) => {
    endpointHandlers.handlePublicEndpoint(req, res);
});


app.get('/api/private', (req, res) => {
    endpointHandlers.handlePrivateEndpoint(req, res, oktaJwtVerifier);
});


app.get('/api/access', (req, res) => {

});


app.post('/api/access-hook', (req, res) => {
    webHookHandlers.tokenHandler(req, res);
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))