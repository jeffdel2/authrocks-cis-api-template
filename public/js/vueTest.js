Vue.component('account-item', {
  props: {
   account: Object
 },
  template: "<div class='col-lg-4 col-sm-6'><div class='card'><div class='card-block block-1'><h3 class='card-title'>test</h3><a href='#' title='Read more' class='read-more'>Read more<i class='fa fa-angle-double-right ml-2'></i></a></div></div></div>"
})

new Vue({
  el: '#app',
  data: {
      message: 'Hello Vue!',
      accounts: []
  }
,
  methods: {
    loadAccounts: function() {
      console.log("test")
      this.$http.get('https://okta-example-playground.appspot.com/account')
      .then(response => {
        this.accounts = response.body
        return response.body
      })
    }
  },
  beforeMount(){
    this.loadAccounts()
  }
});
