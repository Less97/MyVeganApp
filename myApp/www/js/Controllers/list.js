angular.module('myApp.Controllers', ['ionic.rating'])
.controller('ListCtrl', function($scope,$state,$cordovaGeolocation,PlacesService) {
 $scope.goToMap = function(){
    $state.go('tab.map'); 
   }
  $scope.places = PlacesService.getPlaces();
  $scope.gotoDetails=function(myPlace){
      $state.go('details',{id:myPlace._id})
  }
})