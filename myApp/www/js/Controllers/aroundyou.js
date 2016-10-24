angular.module('myApp.Controllers', ['ionic.rating'])

.controller('AroundYouCtrl', function($scope,$state,$cordovaGeolocation,$ionicHistory,PlacesService) {
 var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    $scope.places = PlacesService.getPlaces();
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
       
        for(var i=0;i<$scope.places.length;i++){
            
            var pos = new google.maps.LatLng($scope.places[i].location.coordinates[1], $scope.places[i].location.coordinates[0]);
            
            $scope.places[i].marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: pos,
                title:$scope.places[i].name
             });  
             $scope.places[i].marker.addListener('click',function(idx){
                var placeWindow = new google.maps.InfoWindow({
                  content: this.title
                });
                 placeWindow.open($scope.map,this);
             });
        }
    });


 
  }, function(error){
    console.log("Could not get location");
  });
})