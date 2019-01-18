console.log("OktaAuth.js");
var authClient = new OktaAuth(config); // config is defined in views/header.ejs

authClient.session.get().then(function(session) {
  console.log("OktaAuth.js: got session:");
  console.log(session);

  authClient.token.getWithoutPrompt({
    responseType: ["id_token", "token"],
    scopes: ["openid", "email"] // or array of types// optional if the user has an existing Okta session
  }).then(function(tokenOrTokens) {
    console.log("Here are the tokens we fetched:");
    console.log(tokenOrTokens)
    authClient.tokenManager.add('accessToken', tokenOrTokens);
    console.log(tokenOrTokens.sub)
    var base64Url = tokenOrTokens.accessToken.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var info = JSON.parse(window.atob(base64));
    console.log(info)
  }).else(function() {
    console.log("OktaAuth.js: Didn't get tokens");
  })
})
