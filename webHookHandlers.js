const config = require('./endpointHandlers.js');
const utils = require('./utils.js');

module.exports = {
  tokenHandler: function (req, res) {
    console.log("webHookHandlers.tokenHandler()");
    let auth = req.get('Authorization');
    let results = {}

    if(auth == config.OKTA_HOOK_AUTH) {

      results = {
        "commands": [
          {
            "type": "com.okta.identity.patch",
            "value": [
              {
                "op": "add",
                "path": "/claims/account_number",
                "value": "F0" + utils.between(1000, 9999) + "-" + utils.between(1000, 9999)
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
  }
}