// window.alert("test")

var config = {
  url: 'https://login.vanbeeklabs.com',
  tokenManager: {
    storage: 'sessionStorage'
  },
    issuer: 'https://login.vanbeeklabs.com/oauth2/default',
    clientId: '0oahikuahrKHsYSTZ0h7',
    redirectUri: 'http://localhost:3000/authorization-code/callback',

    // Override the default authorize and userinfo URLs
    authorizeUrl: 'https://login.vanbeeklabs.com/oauth2/default/v1/authorize',
    userinfoUrl: 'https://login.vanbeeklabs.com/oauth2/default/v1/userinfo'
};

var validationOptions = {
  issuer: 'https://login.vanbeeklabs.com/oauth2/default'
}


var authClient = new OktaAuth(config);

$( "#loginForm" ).submit(function( event ) {
  event.preventDefault();
});

authClient.session.get()
.then(function(session) {
  console.log(session)
})
.catch(function(err) {
  // not logged in
});

var do_login = function() {

  // var config = {
  //   url: 'https://inmoment.oktapreview.com',
  //
  //   // Optional config
  //   issuer: 'https://inmoment.oktapreview.com/oauth2/default',
  //   clientId: '0oagwqexpbiokWU1a0h7',
  //   redirectUri: 'http://localhost:8080/authorization-code/callback',
  //
  //   // Override the default authorize and userinfo URLs
  //   authorizeUrl: 'https://inmoment.oktapreview.com/oauth2/default/v1/authorize',
  //   userinfoUrl: 'https://inmoment.oktapreview.com/oauth2/default/v1/userinfo',
  //
  //   // TokenManager config
  //   tokenManager: {
  //     storage: 'sessionStorage'
  //   }
  // };
  // var authClient = new OktaAuth(config);
  authClient.signIn({
    username: $("input[name='Name']").val(),
    password: $("input[name='Password']").val()
  })
  .then(function(transaction) {
    if (transaction.status === 'SUCCESS') {
      // Step #1: get sessionToken
      console.log('sessionToken = ', transaction.sessionToken);



      authClient.session.setCookieAndRedirect(transaction.sessionToken, "http://localhost:3000/accountPage");


      // Step #2: retrieving a session cookie via OpenID Connect Authorization Endpoint
      // Requires the user be authenticated already (i.e. the transaction.sessionToken exists. See Step #1)
      // Uses response_mode=form_post: This will POST authorization_code and state to the redirectUri
      // authClient.token.getWithRedirect({
      //     responseType: 'code',
      //     sessionToken: transaction.sessionToken,
      //     scopes: ['openid', 'email', 'profile'],
      // });
    } else {
      throw 'We cannot handle the ' + transaction.status + ' status';
    }
  })
  .fail(function(err) {
    console.error(err);
  });
}
