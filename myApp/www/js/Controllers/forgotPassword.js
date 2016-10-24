angular.module('myApp.Controllers', ['ionic.rating'])
.controller('ForgotPasswordCtrl', function($scope,$state) {
  $scope.sendPassword = function(user) {
    $state.go('login');
  };
})