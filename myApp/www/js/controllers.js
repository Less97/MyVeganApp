angular.module('myApp.Controllers', ['ionic.rating'])

/*Around you Controller */
.controller('AroundYouCtrl', function ($scope, $state, $cordovaGeolocation, $ionicHistory, $compile,PlacesService, LoadingHelper, ImageHelper) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };
  $scope.currentPlace = null;
  $scope.goFromMap = function(){
    var myId = $scope.currentPlace._id.$oid;
     $state.go('details', {
      id: myId,
      from:0,
    })
  }
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
 var myInfoWindow = new google.maps.InfoWindow({
            content: ''
          });
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
            icon: ImageHelper.getPinIcon($scope.places[i].type),
            idx:i,
            oid:$scope.places[i]._id.$oid
          });

          $scope.places[i].marker.addListener('click', function () {
            $scope.currentPlace = $scope.places[this.idx];
            var content = "<div class='scrollFix'><h5>"+$scope.currentPlace.name+"</h5><div>"+$scope.currentPlace.description+"</div><div style='float:right;margin-top:10px'><button class='button button-positive' ng-click='goFromMap()'>See details</button></div>"
            var compiled = $compile(content)($scope)
            myInfoWindow.setContent(compiled[0])
            myInfoWindow.open($scope.map, this);
          });
        }
      });
     

      var uMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: 'img/pins/home.png'
      });
      uMarker.addListener('click', function () {
        myInfoWindow.setContent('your position')
        myInfoWindow.open($scope.map, this);
      });
    });
  }, function (error) {
    console.log("Could not get location");
  });
})

/* ListCtrl*/
.controller('ListCtrl', function ($scope, $state, $cordovaGeolocation, $ionicHistory, 
$ionicLoading, PlacesService, ResponseHelper,LoadingHelper, ImageHelper) {

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

    PlacesService.getPlaces(position.coords.latitude, position.coords.longitude, $scope.currentTextFilter, 0, 3000, function (response) {
      LoadingHelper.hide();
      ResponseHelper.handleResponse(response,{errorText:"Sorry there was a problem loading data. Please check the connection and retry"},function(){
        $scope.places = response;
      },function(){
        $ionicHistory.nextViewOptions({
        disableBack: true
        });
        $state.go("login");
      })
    });
  });
  $scope.gotoDetails = function (myPlace) {
    $state.go('details', {
      id: myPlace._id.$oid,
      from:1
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
.controller('DetailsCtrl', function ($scope, $stateParams, $state, PlacesService,
 $cordovaGeolocation, $cordovaLaunchNavigator, LoadingHelper,PopupHelper) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };
  $scope.isDetailVisible = false;
  LoadingHelper.show();
  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    PlacesService.getDetails($stateParams.id, position.coords.latitude, position.coords.longitude,
      function (details) {
        $scope.isDetailVisible = true;
        $scope.details = details;
        $scope.details.latitude = $scope.details.location.coordinates[1];
        $scope.details.longitude = $scope.details.location.coordinates[0];
        LoadingHelper.hide();

        $scope.navigate = function () {

          $cordovaLaunchNavigator.navigate([$scope.details.latitude, $scope.details.longitude], {
            start: [position.coords.latitude, position.coords.longitude],
            enableDebug: true
          }).then(function () {
            
          }, function (err) {
            PopupHelper.showError({errorText:"Sorry, there was an error opening google maps. Please check that you have google or apple map on your device."})
          });
        };

      });
  });
  $scope.goBack = function () {
    if($stateParams.from==0){
       $state.go('tab.map')
    }else{
      $state.go('tab.list')
    }
   
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
.controller('AddPlaceCtrl', function ($scope, $state, PlacesService, LoadingHelper,ResponseHelper) {

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
    $state.go('addReview', {
      placeId: $stateParams.id
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
.controller('AddReviewCtrl', function ($scope, $stateParams, $cordovaCamera,$ionicHistory,$ionicPopup,
 ReviewsService, LoadingHelper, UtilsService,ResponseHelper,PopupHelper) {

  $scope.review = {}
  $scope.review.placeId = $stateParams.placeId;
  $scope.review.reviewerId = UtilsService.getLoginData().user._id.$oid;

  var cameraMethod = null;

    $ionicPopup.show({
      title:'Select Source',
      subTitle:'Where do you want to get the image from?',
      scope: $scope,
      buttons: [
      {
        text: '<b>Take Picture</b>',
        type: 'button-positive',
        onTap: function(e) {
          cameraMethod = Camera.PictureSourceType.CAMERA;
          getPicture(cameraMethod);
        }
      },
      {
        text: '<b>Open Library</b>',
        type: 'button-positive',
        onTap: function(e) {
          cameraMethod = Camera.PictureSourceType.PHOTOLIBRARY;
          getPicture(cameraMethod);
        }
      }
    ]
    })


  function getPicture(source){

  var options = {
    quality: 75,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: source,
    encodingType: Camera.EncodingType.JPEG,
    correctOrientation: true
  };

  $cordovaCamera.getPicture(options).then(function (imageData) {
    $scope.review.image = "data:image/jpeg;base64," + imageData;
  }, function (err) {
    PopupHelper.showError({errorText:"Sorry, there was a problem adding the review."})
  });

  $scope.addreview = function (review, form) {

    // check to make sure the form is completely valid
    if (form.$valid) {
      LoadingHelper.show();
      ReviewsService.addReview(review, function (result) {
        LoadingHelper.hide();
        ResponseHelper.handleSaveResponse(result,
          {
            successText:"Thank you. Your review has been saved correctly",
            errorText:"Sorry, there was a problem saving your review. Please retry."
          },function(){
            $ionicHistory.goBack(-1);
          })
      })
    } else {
      
    } 
  }; //register
  }
})

/*Info Controller*/
.controller('InfoCtrl', function ($scope) {})


/*Menu Controller*/
.controller('GalleryCtrl', function ($scope, $state, $stateParams, GalleryService, UtilsService) {
  $scope.imgsId = $stateParams.imgs;
  $scope.addImage = function () {
    $state.go('addImage', {
      placeId: $stateParams.id
    })
  };
  $scope.isGalleryEmpty = $scope.imgsId.length == 0;
  $scope.getFullUrl = function (img) {
    return UtilsService.getBaseUrl() + 'images/get?imgId=' + img.$oid;
  }
})

/* Add Image controller*/
.controller('AddImageCtrl', function ($scope, $state, $stateParams,$ionicHistory, $ionicPopup, 
  $cordovaCamera, LoadingHelper, PlacesService, ResponseHelper,PopupHelper) {

  var pId = $stateParams.placeId;
  
  var cameraMethod = null;

    $ionicPopup.show({
      title:'Select Source',
      subTitle:'Where do you want to get the image from?',
      scope: $scope,
      buttons: [
      {
        text: '<b>Take Picture</b>',
        type: 'button-positive',
        onTap: function(e) {
          cameraMethod = Camera.PictureSourceType.CAMERA;
          getPicture(cameraMethod);
        }
      },
      {
        text: '<b>Open Library</b>',
        type: 'button-positive',
        onTap: function(e) {
          cameraMethod = Camera.PictureSourceType.PHOTOLIBRARY;
          getPicture(cameraMethod);
        }
      }
    ]
    })

  
function getPicture(source){
var options = {
    quality: 75,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: source,
    encodingType: Camera.EncodingType.JPEG,
    correctOrientation: true
  };

  $cordovaCamera.getPicture(options).then(function (imageData) {
    $scope.image = "data:image/jpeg;base64," + imageData;
    var myObj = {
      image: $scope.image,
      placeId: pId
    }
    LoadingHelper.show();
    PlacesService.addGalleryItem(myObj, function (result) {
      LoadingHelper.hide();
      ResponseHelper.handleSaveResponse(result,{
        errorText: "Sorry, an error occurred during saving.",
        successText: "Thank you. We saved correctly your image"
      },function(){
        $ionicHistory.goBack(-1)
      });
      
    });
  }, function (err) {
    PopupHelper.showError({
      errorText: "Sorry, there was an error taking the picture"
    }, function () {
      $ionicHistory.goBack(-1);
    })
  });
  }

})

/*Login Controller*/
.controller('LoginCtrl', function ($scope, $state, $ionicLoading, LoginService, LoadingHelper,PopupHelper) {
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
      if(result==false){
        PopupHelper.showError({errorText:"Sorry there was a problem connecting to the service."})
      }
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
