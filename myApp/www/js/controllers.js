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
  $scope.goToGallery = function (details) {
    $state.go('gallery', {
      id: details._id.$oid,
      imgs: details.gallery
    })
  }
})

/*Add Controller*/
.controller('AddPlaceCtrl', function ($scope, $state, PlacesService, LoadingHelper) {

  $scope.isErrorMessageShown = false;
  $scope.isSuccessMessageShown = false;

  $scope.goBack = function () {
    $state.go('tab.list')
  }


  $scope.onAddressSelection = function (location) {

  }

  $scope.goToList = function () {
    $state.go("tab.list");
  }

  $scope.submit = function (place, form) {
    if (form.$valid) {
      LoadingHelper.show();
      PlacesService.submitPlace(place, function (result) {
        LoadingHelper.hide();
        if (result === false) {
          $scope.isErrorMessageShown = true
        } else if (result.hasOwnProperty("Error")) {
          $scope.isErrorMessageShown = true;
          $scope.errorMessage = result.Message;
        } else if (result.result === true) {
          $scope.isErrorMessageShown = false;
          $scope.isSuccessMessageShown = true;
        }
      })
    }
  }
})

/*Reviews Controller*/
.controller('ReviewsCtrl', function ($scope, $state, $stateParams, ReviewsService, UtilsService, $ionicSlideBoxDelegate) {
  $scope.reviews = ReviewsService.getReviews($stateParams.id, function (rs) {
    $scope.reviews = rs;
    $scope.isEmpty = rs.length == 0;
    $ionicSlideBoxDelegate.update();
  });

  $scope.noReviews = $scope.reviews == 0;

  $scope.getFullUrl = function (img) {
    return UtilsService.getBaseUrl() + 'images/get?imgId=' + img.$oid;
  }

  $scope.addreview = function () {
    $state.go('addReview',{
      placeId:$stateParams.id
    })
  }
  $scope.goBack = function () {
    $state.go('details')
  }
  $scope.getFullUrl = function (imgId) {
    return UtilsService.getBaseUrl() + 'images/get?imgId=' + imgId.$oid;
  }

})

/*Reviews Controller*/
.controller('AddReviewCtrl1', function ($scope, $stateParams, $cordovaCamera, ReviewsService, LoadingHelper,UtilsService) {

  $scope.review = {}
  $scope.review.placeId = $stateParams.placeId;
  $scope.review.reviewerId = UtilsService.getLoginData().user._id.$oid;

  var options = {
    quality: 75,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.CAMERA,
    encodingType: Camera.EncodingType.JPEG,
    saveToPhotoAlbum: true,
    correctOrientation: true
  };

  $cordovaCamera.getPicture(options).then(function (imageData) {
    $scope.review.image = "data:image/jpeg;base64," + imageData;
  }, function (err) {
    // An error occured. Show a message to the user
  });

  $scope.addreview = function (review, form) {

    // check to make sure the form is completely valid
    if (form.$valid) {
       LoadingHelper.show();
       ReviewsService.addReview(review, function (result) {
        LoadingHelper.hide();
        if(false){
          //error
        }else{

        }
      })
    } else {
      console.log("invalid");
    }
  }; //register

})

.controller('AddReviewCtrl', function ($scope, $stateParams, $cordovaCamera, ReviewsService, LoadingHelper,UtilsService) {
   
  $scope.review = {}
  $scope.review.placeId = $stateParams.placeId;
  $scope.review.reviewerId = UtilsService.getLoginData().user._id.$oid;
  $scope.review.image = "data:image/gif;base64,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";

  $scope.addreview = function (review, form) {
   
    // check to make sure the form is completely valid
    if (form.$valid) {
      LoadingHelper.show();
      ReviewsService.addReview(review, function (result) {
        LoadingHelper.hide();
        if(result==false){
          //error
          alert("Sorry, there was a problem during saving the review. Please Check the connection and retry");
        }else if(result.result==1){
          alert("Review created correctly.")
        }
      })


    } else {

    }
  }; //register


})

/*Info Controller*/
.controller('InfoCtrl', function ($scope) {})


/*Menu Controller*/
.controller('GalleryCtrl', function ($scope, $state, $stateParams, GalleryService, UtilsService) {
  $scope.imgsId = $stateParams.imgs;
  $scope.addImage = function () {
    $state.go('addImage')
  };
  $scope.isGalleryEmpty = $scope.imgsId.length == 0;
  $scope.getFullUrl = function (img) {
    return UtilsService.getBaseUrl() + 'images/get?imgId=' + img.$oid;
  }
})

/* Add Image controller*/
.controller('AddImageCtrl', function ($scope, $state, $stateParams, GalleryService) {

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
