// FIXME: Generate this dynamically, or perhaps geneate via .ejs

// window.alert("test")

// config is dynmaically defined and loaded into the JS namespace in views/header.ejs
var config = {
  url: 'https://login.vanbeeklabs.com',
config.  tokenManager: {
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

  authClient.signIn({
    username: $("input[name='Name']").val(),
    password: $("input[name='Password']").val()
  })
  .then(function(transaction) {
    if (transaction.status === 'SUCCESS') {
      // Step #1: get sessionToken
      console.log('sessionToken = ', transaction.sessionToken);

      authClient.session.setCookieAndRedirect(transaction.sessionToken, "http://localhost:3000/accountPage");

    } else {
      throw 'We cannot handle the ' + transaction.status + ' status';
    }
  })
  .fail(function(err) {
    console.error(err);
  });
}
