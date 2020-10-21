const config = {
  OKTA_HOOK_AUTH:     "1234567890", //Set this as the 'Authentication secret' in your Okta Token Hook
  EXPECTED_AUDIENCE:  "<set Audience Here e.g. api://funauth>", //This is the Audience in your Okta Authorization Server
  OKTA_ISSUER:        "<set issuer here e.g. https://yourOktaSubdomain.okta.com/oauth2/ausule8ubxCvrphxX0h7>", //This is the Issuer in your Okta Authorization Server
  OKTA_CLIENT_ID:     "<set client id here e.g. 0oau05aan8tvv5p540h7>", // This is the cliend Id of the funAuth application in Okta
}

module.exports = config;