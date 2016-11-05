var address = "http://localhost:51067/api/myVegAppApi";
var currentLoginData = {};
angular.module('myApp.Service', [])
  .factory('LoginService', function ($http) {
    return {
      login: function (eml, pwd, callback) {
       var req = {
            url:address+"/login",
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
      createUser: function () {

      }
    }
  })

.factory('PlacesService', function ($http) {
    {
      return {
        getPlaces: function (lat,lng,txt,maxDist,type,callback) {
          var req = {
            url:address+"/getPlaces",
            params:{latitude:lat,longitude:lng,searchText:txt,maxDistance:300,tipology:0},
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
            url:address+"/getPlaceDetails",
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
  .factory('ReviewsService', function () {
    return {
      getReviews: function (id,callback) {
       var req = {
            url:address+"/getReviews",
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

.factory('MenuService', function () {
  var menu = [{
    "name": "The amazing salad",
    "price": 10.5,
    "tipology": 7
  }, {
    "name": "The vegan lasagna",
    "price": 12.5,
    "tipology": 7
  }]

  return {
    getMenu: function (placeId) {
      return menu;
    }
  }
})
