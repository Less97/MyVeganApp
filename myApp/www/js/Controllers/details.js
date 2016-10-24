angular.module('myApp.Controllers', ['ionic.rating'])
.controller('DetailsCtrl',function($scope,$stateParams,$state,PlacesService){
  $scope.details = PlacesService.getDetails($stateParams.id);
  var lat = $scope.details.location.coordinates[1];
  var lng = $scope.details.location.coordinates[0];
var latLng = new google.maps.LatLng(lat, lng);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
       var uWindow = new google.maps.InfoWindow({
          content: '<h4>You</h4>'
       });
       
        var uMarker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
        }); 
         uMarker.addListener('click', function() {
              uWindow.open($scope.map, this);
          });  
      });
});
