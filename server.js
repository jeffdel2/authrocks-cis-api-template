const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const app = express();
const port = 3000;

const OKTA_HOOK_AUTH = "1234567890";
const OKTA_AUTH_SERVER_AUDIENCE = "api://default";
const OKTA_ISSUER = "https://mr2.oktapreview.com/oauth2/default";
const OKTA_CLIENT_ID = "0oau05aan8tvv5p540h7";

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: OKTA_ISSUER,
  clientId: OKTA_CLIENT_ID
});

app.get('/', (req, res) => {
    res.send('This is the Fun Auth API');
});


app.get('/api/public', (req, res) => {
    let results = {
      "success": true,
      "message": "This is the Public API, Anyone can request this"
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
});


app.get('/api/private', (req, res) => {
    let auth = req.get('Authorization');
    let accessTokenString = "";
    let results = {};
  
    res.setHeader('Content-Type', 'application/json');
  
    if(auth) {
      accessTokenString = auth.replace("Bearer ", "");
    }
  
    oktaJwtVerifier.verifyAccessToken(accessTokenString, OKTA_AUTH_SERVER_AUDIENCE)
    .then(jwt => {
      // the token is valid (per definition of 'valid' above)
      console.log(jwt.claims);
      results = {
        "success": true,
        "message": "This is the private API, Only a valid Okta JWT with a corresponding auth server can see this"
      }
      
      res.end(JSON.stringify(results));
    })
    .catch(err => {
      // a validation failed, inspect the error
      console.log(err);
      
      results = {
        "success": false,
        "message": "This is the private API and the token is invalid!"
      }
      res.status(403);
      
      res.end(JSON.stringify(results));
    });
});


app.get('/api/access', (req, res) => {
    let auth = req.get('Authorization');
    let accessTokenString = "";
    let results = {};
  
    res.setHeader('Content-Type', 'application/json');
  
    if(auth) {
      accessTokenString = auth.replace("Bearer ", "");
    }
  
    oktaJwtVerifier.verifyAccessToken(accessTokenString, OKTA_AUTH_SERVER_AUDIENCE)
    .then(jwt => {
      // the token is valid (per definition of 'valid' above)
      console.log(jwt.claims);
      
      if(jwt.claims["access"] == "GRANTED") {
        results = {
          "success": true,
          "message": "This is the private API that requires a specifc role to access, Only a valid Okta JWT with the correct claims and a corresponding auth server can see this"
        }  
      } else {
        results = {
          "success": false,
          "message": "This is the private API that requires a specifc role to access, 'access' claim is missing the 'GRANTED' value."
        }
      }
      
      res.end(JSON.stringify(results));
    })
    .catch(err => {
      // a validation failed, inspect the error
      console.log(err);
      
      results = {
        "success": false,
        "message": "This is the private API and the token is invalid!"
      }
      res.status(403);
      
      res.end(JSON.stringify(results));
    });
});


app.post('/api/access-hook', (req, res) => {
    let auth = req.get('Authorization');
    let results = {}
    
    if(auth == OKTA_HOOK_AUTH) {
  
      results = {
        "commands": [
          {
            "type": "com.okta.identity.patch",
            "value": [
              {
                "op": "add",
                "path": "/claims/account_number",
                "value": "F0" + between(1000, 9999) + "-" + between(1000, 9999)
              }
            ]
          },
          {
            "type": "com.okta.access.patch",
            "value": [
              {
                "op": "add",
                "path": "/claims/access",
                "value": "GRANTED"
              }
            ]
          }
        ]
      };
    } else {
      results = {
        "success": false,
        "message": "Requires Auth to call this hook."
      }
      res.status(403);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
});


function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))