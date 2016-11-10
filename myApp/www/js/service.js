var address = "http://thecuriouscarrot.com/api/";
//var address = "http://localhost:51067/api/";
var currentLoginData = {};
angular.module('myApp.Service', [])
  .factory('LoginService', function ($http) {
    return {
      login: function (eml, pwd, callback) {
       var req = {
            url:address+"users/login",
            data:{email:eml,password:pwd},
            method:'POST',
            headers:{'Content-Type':"application/json"}
       }
       $http(req).success(function (data) {
         data = JSON.parse(data);
         if(data.isLoggedIn)
            currentLoginData = data;

       callback(data.isLoggedIn); 
            
       }).error(function () {
          callback(false);
      })},
      register: function () {
          return true
      }
    }
  })

.factory('PlacesService', function ($http) {
    {
      return {
        getPlaces: function (lat,lng,txt,maxDist,type,callback) {
          var req = {
            url:address+"places/getPlaces",
            params:{latitude:lat,longitude:lng,searchText:txt,maxDistance:3000,tipology:0},
            method:'GET',
          }
          $http(req).success(function(data){
            data = JSON.parse(data);
            callback(data)
          }).error(function(){
            callback([]);
          })
        },
        getDetails: function (id,latitude,longitude,callback) {
           var req = {
            url:address+"places/getPlaceDetails",
            params:{placeId:id,latitude:latitude,longitude:longitude},
            method:'GET',
          }
          $http(req).success(function(data){
            data = JSON.parse(data);
            callback(data)
          }).error(function(){
            callback([]);
          })
        }
      }
    }
  })
  .factory('ReviewsService', function ($http) {
    return {
      getReviews: function (id,callback) {
       var req = {
            url:address+"reviews/getReviews",
            params:{placeId:id},
            method:'GET',
          };
           $http(req).success(function(data){
            data = JSON.parse(data);
            callback(data)
          }).error(function(){
            callback([]);
          })
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

          var successFn = options.successCallBack || function () {
              },
            errorFn = options.errorCallback || function () {
              },
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
