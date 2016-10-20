angular.module('myApp.Controllers', ['ionic.rating'])

.controller('AroundYouMapCtrl', function($scope,$state,$cordovaGeolocation,$ionicHistory) {
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
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
        var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });      
 
    });
 
  }, function(error){
    console.log("Could not get location");
  });

  $scope.goToList = function(){
    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate:true
    });
    
    $state.go('tab.aroundyou-list')    
  }
})

.controller('AroundYouListCtrl', function($scope,$state,$cordovaGeolocation,$ionicHistory,PlacesService) {
 $scope.goToMap = function(){
    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate:true
    });
    $state.go('tab.aroundyou-map'); 
   }
  $scope.places = PlacesService.getPlaces();
  $scope.rating ={
      rating : 3
  };
})

.controller('AddCtrl', function($scope) {
  
  var place = {
    name:"",
    phone:"",
    address:"",
    type:"",
  }


 
})

.controller('InfoCtrl', function($scope) {
  

})


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
       $state.go("tab.aroundyou-map")
     }else{
       $scope.user.loginError = true;
     }
  };
})

.controller('RegisterCtrl',function($scope,$state){

})

.controller('ForgotPasswordCtrl', function($scope,$state) {
  $scope.sendPassword = function(user) {
    $state.go('login');
  };
})
.controller('AccountCtrl', function($scope) {
 
});

