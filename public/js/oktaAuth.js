

var config = {
  url: 'https://login.vanbeeklabs.com',
  issuer: 'https://login.vanbeeklabs.com/oauth2/default',
  clientId: '0oahikuahrKHsYSTZ0h7',
  redirectUri: 'http://localhost:3000/authorization-code/callback',
};

var authClient = new OktaAuth(config);

authClient.session.get().then(function(session) {


  authClient.token.getWithoutPrompt({
    responseType: "token",
    scopes: ["openid", "email"] // or array of types// optional if the user has an existing Okta session
  }).then(function(tokenOrTokens) {
    console.log(tokenOrTokens)
    console.log(tokenOrTokens.sub)
    var base64Url = tokenOrTokens.accessToken.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var info = JSON.parse(window.atob(base64));
    console.log(info)
  })
})
