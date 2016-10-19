angular.module('myApp.Service', [])

.factory('LoginService', function() {
    return {
      login : function(email,password){
        if(email=="Test@test.it"&&password=="Password_123")
          return {loginError : 1}},
      createUser:function(){
        return 1;
      }
      }});
