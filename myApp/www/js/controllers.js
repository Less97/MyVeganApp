angular.module('myApp.Controllers', ['ionic.rating'])



/*Around you Controller */
.controller('AroundYouCtrl', function ($scope, $state, $cordovaGeolocation, $ionicHistory, PlacesService, LoadingHelper, ImageHelper) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  LoadingHelper.show();
  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded



    google.maps.event.addListenerOnce($scope.map, 'idle', function () {

      PlacesService.getPlaces(position.coords.latitude, position.coords.longitude, $scope.currentTextFilter, 0, 300, function (items) {
        LoadingHelper.hide();
        $scope.places = items;

        for (var i = 0; i < $scope.places.length; i++) {

          var pos = new google.maps.LatLng($scope.places[i].location.coordinates[1], $scope.places[i].location.coordinates[0]);

          $scope.places[i].marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: pos,
            title: $scope.places[i].name,
            icon: ImageHelper.getPinIcon($scope.places[i].type)
          });

          $scope.places[i].marker.addListener('click', function (idx) {
            var placeWindow = new google.maps.InfoWindow({
              content: this.title
            });
            placeWindow.open($scope.map, this);
          });
        }
      });
      var uWindow = new google.maps.InfoWindow({
        content: '<h4>You</h4>'
      });

      var uMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: 'img/pins/home.png'
      });
      uMarker.addListener('click', function () {
        uWindow.open($scope.map, this);
      });


    });



  }, function (error) {
    console.log("Could not get location");
  });
})



/* ListCtrl*/
.controller('ListCtrl', function ($scope, $state, $cordovaGeolocation, $ionicHistory, $ionicLoading, PlacesService, LoadingHelper, ImageHelper) {


  $scope.goToMap = function () {
    $state.go('tab.map');
  }
  $scope.currentTextFilter = "";
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };
  LoadingHelper.show();
  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    PlacesService.getPlaces(position.coords.latitude, position.coords.longitude, $scope.currentTextFilter, 0, 3000, function (items) {
      LoadingHelper.hide();
      $scope.places = items;
    });
  });
  $scope.gotoDetails = function (myPlace) {
    $state.go('details', {
      id: myPlace._id.$oid,
    })
  }

  $scope.getImage = function (type) {
    return ImageHelper.getListImg(type);
  }

  $scope.goToAddPlace = function () {
    $state.go('addPlace')
  }
  $scope.back = function () {
    $state.go('tabs.list');
  }
  $scope.returnDistance = function (distance) {
    return distance / 1000;
  }
})




/*Details Controller*/
.controller('DetailsCtrl', function ($scope, $stateParams, $state, PlacesService, $cordovaGeolocation, $cordovaLaunchNavigator, LoadingHelper) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  LoadingHelper.show();
  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    PlacesService.getDetails($stateParams.id, position.coords.latitude, position.coords.longitude,
      function (details) {
        $scope.details = details;
        $scope.details.latitude = $scope.details.location.coordinates[1];
        $scope.details.longitude = $scope.details.location.coordinates[0];
        LoadingHelper.hide();

        $scope.navigate = function () {

          $cordovaLaunchNavigator.navigate([$scope.details.latitude, $scope.details.longitude], {
            start: [position.coords.latitude, position.coords.longitude],
            enableDebug: true
          }).then(function () {
            alert("Navigator launched");
          }, function (err) {
            alert(err);
          });
        };

      });
  });
  $scope.goBack = function () {
    $state.go('tab.list')
  }
  $scope.goToReviews = function (details) {
    $state.go('reviews', {
      id: details._id.$oid
    })
  }


  $scope.openPage = function (website) {
    window.open(website, '_blank');
  }
  $scope.goToMenu = function (details) {
    $state.go('menu', {
      id: details._id
    })
  }
})



/*Add Controller*/
.controller('AddPlaceCtrl', function ($scope, $state,PlacesService,LoadingHelper) {
  
  $scope.isErrorMessageShown = false;
  $scope.isSuccessMessageShown = false;
  
  $scope.goBack = function () {
    $state.go('tab.list')
  }


  $scope.onAddressSelection = function(location){
   
  }

  $scope.goToList = function(){
    $state.go("tab.list");
  }

  $scope.submit = function(place,form){
      if(form.$valid){
        LoadingHelper.show();
        PlacesService.submitPlace(place,function(result){
           LoadingHelper.hide();
            if(result===false){
                $scope.isErrorMessageShown = true
            }else if(result.hasOwnProperty("Error")){
                $scope.isErrorMessageShown =true;
                $scope.errorMessage = result.Message;
            }else if(result.result===true){
               $scope.isErrorMessageShown =false;
                $scope.isSuccessMessageShown = true;
            }
        })
      }
  }
})

/*Add Controller*/
.controller('AddMenuItemCtrl', function ($scope) {
  $scope.goBack = function () {
    $state.go('menu')
  }
})



/*Reviews Controller*/
.controller('ReviewsCtrl', function ($scope, $state, $stateParams, ReviewsService) {
  $scope.reviews = ReviewsService.getReviews($stateParams.id, function (rs) {
    $scope.reviews = rs;
    $scope.isEmpty = rs.length == 0;
  });
  $scope.goToAddReview = function () {
    $state.go('addReview')
  }
  $scope.goBack = function () {
    $state.go('details')
  }
})

/*Reviews Controller*/
.controller('AddReviewCtrl', function ($scope, $stateParams, ReviewsService) {

})





/*Info Controller*/
.controller('InfoCtrl', function ($scope) {})


/*Menu Controller*/
.controller('MenuCtrl', function ($scope, $state, $stateParams, MenuService) {
  $scope.menu = MenuService.getMenu($stateParams.id);
  $scope.goBack = function () {
    $state.go('details')
  }
  $scope.goToAddMenuItem = function () {
    $state.go('addMenuItem')
  }

})


/*Login Controller*/
.controller('LoginCtrl', function ($scope, $state, $ionicLoading, LoginService, LoadingHelper) {
  $scope.user = {
    email: '',
    password: '',
    loginError: false
  }
  $scope.goToNewUser = function () {
    $state.go('register');
  }
  $scope.signIn = function (user) {

    LoadingHelper.show();

    LoginService.login(user.email, user.password, function (result, data) {
      LoadingHelper.hide();
      if (result == true) {
        $state.go("tab.map")
      } else {
        $scope.user.loginError = true;
      }
    })
  }
})


/* Register Controller */
.controller('RegisterCtrl', function ($scope, $state, $ionicSlideBoxDelegate, RegisterService, LoadingHelper) {
  $scope.showInsertCode = false;
  $scope.user = {};
  $scope.code = {
    code: "",
    generatedCode: ""
  }
  $scope.register = function (user, form) {

    // check to make sure the form is completely valid
    if (form.$valid) {
      LoadingHelper.show();
      RegisterService.register(user, function (result) {
        LoadingHelper.hide();
        if (result === false) {
          alert("Sorry, we haven't been able to create the user. Check the connection and retry.");
        }
        if (result.Error === 0 && result.hasOwnProperty("Message")) {
          alert(result.Message)
        } else if (result.hasOwnProperty("GeneratedCode")) {
          $scope.code.generatedCode = result.GeneratedCode;
          $scope.showInsertCode = true;
        }
      })
    }
  }; //register

  $scope.goToLogin = function () {
    $state.go('login');
  }


  $scope.confirmCode = function (code, codeForm) {
    LoadingHelper.show();
    $scope.isCodeNotValid = false;
    $scope.isUserCorrectlyCreated = false;
    if (codeForm.$valid) {
      if (code.enteredCode === $scope.code.generatedCode) {

        RegisterService.confirm($scope.user.email, function (result) {
          LoadingHelper.hide();
          if (result === false) {
            alert("sorry, there was an error registering your user");
          }
          if (result.Error === 0) {
            $scope.isUserCorrectlyCreated = true;
          }
        })
      } else {
        $scope.isCodeNotValid = true;
        LoadingHelper.hide();
      }

    }

  }
})



/*Forget Password Controller*/
.controller('ForgotPasswordCtrl', function ($scope, $state, $ionicHistory, LoadingHelper, RestorePasswordService) {
  $scope.sendPassword = function (email) {
    LoadingHelper.show();
    $scope.code = {};
    RestorePasswordService.restorePassword(email, function (data) {
      LoadingHelper.hide();
      if (data === false || data.Error === 1) {
        $scope.showMessage = true;
        $scope.message = data.Message;
      } else if (data.Error === 0) {
        $scope.email = email;
        $scope.EnterCodeState = 1;
        $scope.code.generatedCode = data.GeneratedCode;
      }
    })
  };

  $scope.confirmCode = function (code) {
    if (code === $scope.code.generatedCode) {
      $state.go("changePassword", {
        email: $scope.email
      });
    } else {
      $scope.codeInvalidMessageVisible = true;
    }
  }
})

.controller("ChangePasswordCtrl", function ($scope, $state, $stateParams, LoadingHelper, RestorePasswordService) {

  $scope.changePassword = function (user, form) {

    if (form.$valid) {
      LoadingHelper.show();
      var userDetails = {
        email: $stateParams.email,
        password: user.password
      }
      RestorePasswordService.changePassword(userDetails, function (data) {
        LoadingHelper.hide();
        if (data === false || data.Error === 1) {
          $scope.changeError = true;
          $scope.errorMessage = data.Message;
        } else if (data.Error === 0) {
          $scope.changeSuccess = true;
        }
      })
    }
  }

  $scope.goToLogin = function () {
    $state.go('login');
  }
})


/*AccountCtrl*/
.controller('AccountCtrl', function ($scope) {

});
