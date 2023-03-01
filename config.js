const config = {
  OKTA_HOOK_AUTH:     "1234567890",
  EXPECTED_AUDIENCE:  "api://authrocks", // This is the audience Id of the CIS authorization server
  OKTA_ISSUER:        "https://my-cis.okta.com/oauth2/default", // This is the issuer of your CIS custom authorization server
  OKTA_CLIENT_ID:     "XXXXXXXXX", // This is the cliend Id of the UI application in Okta
}

module.exports = config;