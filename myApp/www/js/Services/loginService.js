angular.module('myApp.Service', [])
.factory('LoginService', function() {
    return {
      login : function(email,password){
        if(email=="Test@test.it"&&password=="Password_123"){
          return {email:"Test@test.it",password:"Password_123","firstName":"My First Name","lastName":"myLastName"};
      }else {
          return {};
      }},
      createUser:function(){
        return 1;
      }
      }})
