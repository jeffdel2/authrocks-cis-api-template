$( document ).ready(function() {
  $("#okta").show()

  var signIn = new OktaSignIn({
    baseUrl: 'https://avb.oktapreview.com',
  });
  signIn.renderEl(
    // Assumes there is an empty element on the page with an id of 'osw-container'
    {el: '#okta'},
    function success(res) {
      console.log(res)
      window.location.reload()
    },
    function error(err) {
      console.log(err)
    }
  );
});
