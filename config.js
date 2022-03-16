const config = {
  OKTA_HOOK_AUTH:     "1234567890", //Set this as the 'Authentication secret' in your Okta Token Hook
  EXPECTED_AUDIENCE:  "api://glitch", //This is the Audience in your Okta Authorization Server
  OKTA_ISSUER:        "https://delongoie.oktapreview.com/oauth2/aus2939nuuzfZ4jcJ1d7", //This is the Issuer in your Okta Authorization Server
  OKTA_CLIENT_ID:     "0oa2ys2wk4ekuUaiH1d7", // This is the cliend Id of the funAuth application in Okta
}

module.exports = config;