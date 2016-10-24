angular.module('myApp.Controllers', ['ionic.rating'])
.controller('LoginCtrl', function($scope,$state,LoginService) {
  $scope.user = {
      email:'',
      password:'',
      loginError:false
  }
  $scope.goToNewUser=function(){
    $state.go('register');
  }
  $scope.signIn = function(user) {
     if(LoginService.login(user.email,user.password)){
       $state.go("tab.map")
     }else{
       $scope.user.loginError = true;
     }
  };
})
