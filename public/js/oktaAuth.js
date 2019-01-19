console.log("OktaAuth.js");
var authClient = new OktaAuth(config); // config is defined in views/header.ejs

authClient.session.get().then(function(session) {
  console.log("OktaAuth.js: got session:");
  console.log(session);

  authClient.token.getWithoutPrompt({
    responseType: ["id_token", "token"],
    scopes: ["openid", "email"] // or array of types// optional if the user has an existing Okta session
  }).then(function(tokens) {
    console.log("Got tokens:");
    console.log(tokens);
    for (var token in tokens) {
      for (var kind in ['idToken', 'accessToken']) {
        if (kind in token) {
          console.log("Received an " + kind + " from Okta");
          console.log(token);
          authClient.tokenManager.add(kind, token);
        }
      }
    }
    var accessToken = authClient.tokenManager.get('accessToken');
    var base64Url = accessToken.accessToken.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var info = JSON.parse(window.atob(base64));
    console.log(info)
  }).else(function() {
    console.log("OktaAuth.js: Didn't get tokens");
  })
})
