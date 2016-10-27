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
  $scope.goToAdd = function () {
    $state.go('add')
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

  $scope.goToReviews = function (myId) {
    $state.go('reviews', {
      id: myId
    })
  }
})



/*Add Controller*/
.controller('AddCtrl', function ($scope) {

})



/*Reviews Controller*/
.controller('ReviewsCtrl', function ($scope, $stateParams, ReviewsService) {
  $scope.reviews = ReviewsService.getReviews($stateParams.id);

})


/*Info Controller*/
.controller('InfoCtrl', function ($scope) {


})

/*Login Controller*/
.controller('LoginCtrl', function ($scope, $state, LoginService) {
  $scope.user = {
    email: '',
    password: '',
    loginError: false
  }
  $scope.goToNewUser = function () {
    $state.go('register');
  }
  $scope.signIn = function (user) {
    if (LoginService.login(user.email, user.password)) {
      $state.go("tab.map")
    } else {
      $scope.user.loginError = true;
    }
  };
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
