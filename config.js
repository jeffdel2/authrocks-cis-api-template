const config = {
  OKTA_HOOK_AUTH:     "1234567890",
  EXPECTED_AUDIENCE:  "api://default", // This is the audience Id of the CIS authorization server
  OKTA_ISSUER:        "https://delongoie.oktapreview.com/oauth2/default", // This is the issuer of the CIS authorization server
  OKTA_CLIENT_ID:     "0oa5xwvdp0wFh6eO51d7", // This is the cliend Id of the UI application in Okta
}

module.exports = config;