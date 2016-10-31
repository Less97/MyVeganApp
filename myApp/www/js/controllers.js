angular.module('myApp.Controllers', ['ionic.rating'])



/*Around you Controller */
.controller('AroundYouCtrl', function ($scope, $state, $cordovaGeolocation, $ionicHistory, PlacesService) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    $scope.places = PlacesService.getPlaces();
    google.maps.event.addListenerOnce($scope.map, 'idle', function () {

      var uWindow = new google.maps.InfoWindow({
        content: '<h4>You</h4>'
      });

      var uMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
      });
      uMarker.addListener('click', function () {
        uWindow.open($scope.map, this);
      });

      for (var i = 0; i < $scope.places.length; i++) {

        var pos = new google.maps.LatLng($scope.places[i].location.coordinates[1], $scope.places[i].location.coordinates[0]);

        $scope.places[i].marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: pos,
          title: $scope.places[i].name
        });
        $scope.places[i].marker.addListener('click', function (idx) {
          var placeWindow = new google.maps.InfoWindow({
            content: this.title
          });
          placeWindow.open($scope.map, this);
        });
      }
    });



  }, function (error) {
    console.log("Could not get location");
  });
})



/* ListCtrl*/
.controller('ListCtrl', function ($scope, $state, $cordovaGeolocation, $ionicHistory, PlacesService) {
  $scope.goToMap = function () {
    $state.go('tab.map');
  }
  $scope.places = PlacesService.getPlaces();
  $scope.gotoDetails = function (myPlace) {
    $state.go('details', {
      id: myPlace._id
    })
  }
  $scope.goToAddPlace = function () {
    $state.go('addPlace')
  }
  $scope.back = function () {
    $state.go('tabs.list');
  }
})




/*Details Controller*/
.controller('DetailsCtrl', function ($scope, $stateParams, $state, PlacesService) {
  $scope.details = PlacesService.getDetails($stateParams.id);
  $scope.details.latitude = $scope.details.location.coordinates[1];
  $scope.details.longitude = $scope.details.location.coordinates[0];
  $scope.goBack = function(){
    $state.go('tab.list')
  }
  $scope.goToReviews = function (details) {
    $state.go('reviews', {
      id: details._id
    })
  }
  $scope.goToMenu = function (details) {
    $state.go('menu', {
      id: details._id
    })
  }
})



/*Add Controller*/
.controller('AddPlaceCtrl', function ($scope,$state) {
  $scope.goBack = function(){
    $state.go('tab.list')
  }
})

/*Add Controller*/
.controller('AddMenuItemCtrl', function ($scope) {
  $scope.goBack = function(){
    $state.go('menu')
  }
})



/*Reviews Controller*/
.controller('ReviewsCtrl', function ($scope, $stateParams, ReviewsService) {
  $scope.reviews = ReviewsService.getReviews($stateParams.id);
  $scope.goBack = function(){
    $state.go('details')
  }
})




/*Info Controller*/
.controller('InfoCtrl', function ($scope) {


})


/*Menu Controller*/
.controller('MenuCtrl', function ($scope, $state,$stateParams, MenuService) {
  $scope.menu = MenuService.getMenu($stateParams.id);
  $scope.goBack = function(){
    $state.go('details')
  }
  $scope.goToAddMenuItem=function(){
    $state.go('addMenuItem')
  }

})


/*Login Controller*/
.controller('LoginCtrl', function ($scope, $state,$ionicLoading, LoginService) {
  $scope.user = {
    email: '',
    password: '',
    loginError: false
  }
  $scope.goToNewUser = function () {
    $state.go('register');
  }
  $scope.signIn = function (user) {

     $ionicLoading.show({
     content: 'Loading',
     animation: 'fade-in',
     showBackdrop: true,
     maxWidth: 200,
     showDelay: 0
  });

    LoginService.login(user.email, user.password,function(result,data){
      $ionicLoading.hide();
      if(result==true){
        $state.go("tab.map")
      }else{
        $scope.user.loginError = true;
      }
   })
  }
  })


/* Register Controller */
.controller('RegisterCtrl', function ($scope, $state) {

})


/*Forget Password Controller*/
.controller('ForgotPasswordCtrl', function ($scope, $state) {
  $scope.sendPassword = function (user) {
    $state.go('login');
  };
})

/*AccountCtrl*/
.controller('AccountCtrl', function ($scope) {

});
