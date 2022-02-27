const config = {
  OKTA_HOOK_AUTH:     "1234567890", //Set this as the 'Authentication secret' in your Okta Token Hook
  EXPECTED_AUDIENCE:  "api://grointel", //This is the Audience in your Okta Authorization Server
  OKTA_ISSUER:        "https://udp-gro-intel-bc2.oktapreview.com/oauth2/aus15rdm3jlcRu4IB0h8", //This is the Issuer in your Okta Authorization Server
  OKTA_CLIENT_ID:     "0oa15rdbfgcpFYkU60h8", // This is the cliend Id of the funAuth application in Okta
}

module.exports = config;