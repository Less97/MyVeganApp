angular.module('myApp.Controllers', [])

.controller('AroundYouCtrl', function($scope) {})

.controller('SearchCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })

.controller('InfoCtrl', function($scope) {
  
})


.controller('LoginCtrl', function($scope,$state,LoginService) {
  $scope.user = {
      email:'',
      password:'',
      loginError:false
  }
  $scope.goToNewUser=function(){
    $state.go('createUser');
  }
  $scope.signIn = function(user) {
     if(LoginService.login(user.email,user.password)){
       $state.go("tab.aroundyou")
     }else{
       $scope.user.loginError = true;
     }
  };
})

.controller('CreateUserCtrl',function($scope,$state){

})

.controller('ForgotPasswordCtrl', function($scope,$state) {
  $scope.sendPassword = function(user) {
    $state.go('login');
  };
})
.controller('AccountCtrl', function($scope) {
 
});

