var address = "http://thecuriouscarrot.com/api/";
//var address = "http://localhost:51067/api/";
angular.module('myApp.Service', [])
  .factory('UtilsService', function ($http) {
    return {
      getBaseUrl: function () {
        return address;
      },
      getLoginData:function(){
        return JSON.parse( window.localStorage.getItem('loginData' ));
      },
      getSearchSettings:function(){
        var data = JSON.parse( window.localStorage.getItem('searchSettings' ));
        if(data == null){
          return false;
        }
        return data;
      },
      saveSearchSettings:function(data){
         window.localStorage.setItem( 'searchSettings', JSON.stringify(data));
      }
    }
  })
  .factory('LoginService', function ($http) {
    return {
      login: function (eml, pwd, callback) {
        var req = {
          url: address + "users/login",
          data: {
            email: eml,
            password: pwd
          },
          method: 'POST',
          headers: {
            'Content-Type': "application/json"
          }
        }
        $http(req).success(function (data) {
          data = JSON.parse(data);
          if (data.isLoggedIn)
            window.localStorage.setItem( 'loginData', JSON.stringify(data));
          
          callback(data.isLoggedIn);

        }).error(function () {
          callback(false);
        })
      },
      isLogged: function(){
          var data = JSON.parse( window.localStorage.getItem('loginData' ));
          if(data==null)
            return false;
          return data.isLoggedIn;
      },
      logout : function(){
         window.localStorage.setItem( 'loginData', {});
      }

    }
  })
  .factory("RegisterService", function ($http) {
    return {
      register: function (user, callback) {
        var req = {
          url: address + "users/register",
          data: user,
          method: 'POST',
        };
        $http(req).success(function (data) {
          callback(JSON.parse(data));
        }).error(function () {
          callback(false)
        })
      },
      confirm: function (eml, callback) {
        var req = {
          url: address + "users/confirmEmail",
          data: {
            email: eml
          },
          method: 'POST'
        }
        $http(req).success(function (data) {
          var data = JSON.parse(data)
          callback(data);
        }).error(function () {
          callback(false);
        })
      }
    }

  })
  .factory("RestorePasswordService", function ($http) {
    return {
      restorePassword: function (eml, callback) {
        var req = {
          url: address + 'users/restorePassword',
          data: {
            email: eml
          },
          method: 'POST'
        }
        $http(req).success(function (data) {
          var data = JSON.parse(data);
          callback(data);
        }).error(function () {
          callback(false)
        })
      },
      changePassword: function (userDetails, callback) {
        var req = {
          url: address + 'users/changePassword',
          data: {
            email: userDetails.email,
            password: userDetails.password
          },
          method: 'POST'
        };
        $http(req).success(function (data) {
          var data = JSON.parse(data);
          callback(data);
        }).error(function () {
          callback(false)
        })
      }

    }

  })


.factory('PlacesService', function ($http) {
    {
      return {
        getPlaces: function (lat, lng, txt, maxDist,selTags, type, callback) {
          var req = {
            url: address + "places/getPlaces",
            params: {
              latitude: lat,
              longitude: lng,
              searchText: txt,
              maxDistance: maxDist,
              tags:selTags,
              tipology: 0
            },
            method: 'GET',
            cache:false
          }
          $http(req).success(function (data) {
            data = JSON.parse(data);
            callback(data)
          }).error(function () {
            callback({error:true});
          })
        },
        getDetails: function (id, latitude, longitude, callback) {
          var req = {
            url: address + "places/getPlaceDetails",
            params: {
              placeId: id,
              latitude: latitude,
              longitude: longitude
            },
            method: 'GET',
          }
          $http(req).success(function (data) {
            data = JSON.parse(data);
            callback(data)
          }).error(function () {
            callback(false);
          })
        },
        submitPlace: function (plc, callback) {
          var req = {
            url: address + 'places/createPlace',
            data: {
              name: plc.name,
              type: plc.type,
              website: plc.website,
              description: plc.description,
              openingHours: plc.openingHours,
              phoneNumber: plc.phoneNumber,
              email: plc.email,
              latitude: plc.location.geometry.location.lat(),
              longitude: plc.location.geometry.location.lng(),
              address: plc.location.formatted_address,
              countryId: plc.country
            },
            method: 'POST'
          }
          $http(req).success(function (data) {
            var obj = JSON.parse(data);
            callback(obj);
          }).error(function () {
            callback(false);
          })
        },
        addGalleryItem: function(galleryItm,callback){
          console.log("adding gallery item;");
          console.log("myItm:");
          console.dir(galleryItm)
          var req = {
            url: address + 'places/addGalleryItem',
            method:'POST',
            data:galleryItm
          }
          console.log("request");
          console.dir(req);
          $http(req)
          .success(function(data){
            var result = JSON.parse(data);
            console.log("success result:"+result);
            callback(result);
          })
          .error(function(result){
            console.log("cannot connect error: "+result);
            console.dir(result);
            callback(false)
          })
        }
      }
    }
  })
  .factory('ImageService', function ($http) {
    return {
      saveImage: function (imgData, callback) {
          var fd = new FormData();
        fd.append("file", imgData);
        $http.post(address+'images/uploadimage', fd, {
        withCredentials : false,
        headers : {
          'Content-Type' : undefined
        },
        transformRequest : angular.identity
        })
        .success(function(data)
        {
          console.log(data);
        })
        .error(function(data)
        {
          console.log(data);
        });
      }
    }
  })
  .factory('ReviewsService', function ($http) {
    return {
      getReviews: function (id, callback) {
        var req = {
          url: address + "reviews/getReviews",
          params: {
            placeId: id
          },
          method: 'GET',
        };
        $http(req).success(function (data) {
          data = JSON.parse(data);
          callback(data)
        }).error(function () {
          callback([]);
        })
      },
      addReview:function(rev,callback){
         console.log("adding review");
         console.dir(rev);
         var req = {
          url: address + "reviews/addreview",
          data: rev,
          method: 'POST',
        };
        console.log("----------");
        console.dir(req);
        $http(req).success(function (data) {
          data = JSON.parse(data);
          console.log(data);
          callback(data)
        }).error(function (error) {
          console.log("error connecting to add review");
          console.dir(error);
          callback(false)
        })
      }
    }
  })
  .factory('GalleryService', function ($http) {
    return {
      get: function (id, callback) {
        var req = {
          url: address + "reviews/getReviews",
          params: {
            placeId: id
          },
          method: 'GET',
        };
        $http(req).success(function (data) {
          data = JSON.parse(data);
          callback(data)
        }).error(function () {
          callback([]);
        })
      }
    }
  })
.factory('TagService', function ($http) {
    return {
      getTags: function (callback) {
       var req = {
        url:address+ "tags/gettags",
        method: 'GET'
       };

       $http(req).success(function(data){
          data = JSON.parse(data);
        callback(data);
       }).error(function(){
        callback([])
        });

    }
    }
  })


// Define an Angular service to wrap the plugin
.service('$cordovaLaunchNavigator', ['$q', function ($q) {
  "use strict";

  var $cordovaLaunchNavigator = {};
  $cordovaLaunchNavigator.navigate = function (destination, options) {
    var q = $q.defer(),
      isRealDevice = ionic.Platform.isWebView();

    if (!isRealDevice) {
      q.reject("launchnavigator will only work on a real mobile device! It is a NATIVE app launcher.");
    } else {
      try {

        var successFn = options.successCallBack || function () {},
          errorFn = options.errorCallback || function () {},
          _successFn = function () {
            successFn();
            q.resolve();
          },
          _errorFn = function (err) {
            errorFn(err);
            q.reject(err);
          };

        options.successCallBack = _successFn;
        options.errorCallback = _errorFn;

        launchnavigator.navigate(destination, options);
      } catch (e) {
        //q.reject("Exception: " + e.message);
      }
    }
    return q.promise;
  };

  return $cordovaLaunchNavigator;
}])
