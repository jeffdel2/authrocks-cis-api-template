const express = require('express');
const app = express();
const port = 3000;

const OKTA_HOOK_AUTH = "1234567890";

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
    let results = {
      "success": true,
      "message": "This is the private API, Only a valid Okta JWT with a corresponding auth server can see this"
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
});


app.get('/api/access', (req, res) => {
    let results = {
      "success": true,
      "message": "This is the private API that requires a specifc role to access, Only a valid Okta JWT with the correct claims and a corresponding auth server can see this"
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
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