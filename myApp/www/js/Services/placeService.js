angular.module('myApp.Service', [])
.factory('PlacesService',function(){

var placesSample = [{
    "_id" :"57fe828211652af20268d814",
    "name" : "Giovinda's",
    "type" : "restaurant",
    "phoneNumber" : "000-000000",
    "address" : "4 Aungier St, Dublin 2",
    "location" : {
        "coordinates" : [ 
            -6.265116, 
            53.34127
        ],
        "type" : "Point"
    },
    "menu" : [ 
        {
            "dishName" : "Dish 3",
            "price" : 10.5,
            "tipology" : 7
        }
    ],
    "nReviews" : 5,
    "rating" : 3.5
},
{
    "_id" : "5800f1c711652af20268d816",
    "name" : "Umi Falafel",
    "type" : "restaurant",
    "phoneNumber" : "000-000000",
    "address" : "13 Dame Street, Dublin 2",
    "location" : {
        "coordinates" : [ 
            -6.2676697, 
            53.344242
        ],
        "type" : "Point"
    },
    "menu" : [ 
        {
            "dishName" : "Dish 2",
            "price" : 11.5,
            "tipology" : 2
        }
    ],
    "nReviews" : 1,
    "rating" : 4
},
{
    "_id" : "58034b9511652af20268d817",
    "name" : "Galwy Veggie",
    "type" : "restaurant",
    "phoneNumber" : "000-000000",
    "address" : "Galway Street",
    "location" : {
        "coordinates" : [ 
            -9.056994, 
            53.273838
        ],
        "type" : "Point"
    },
    "menu" : [ 
        {
            "dishName" : "Dish 2",
            "price" : 9.5,
            "tipology" : 5
        }
    ],
    "nReviews" : 1,
    "rating" : 3
},
{
    "_id" : "58038b3c11652af20268d818",
    "name" : "Cornucopia",
    "type" : "restaurant",
    "phoneNumber" : "000-000000",
    "address" : "19-20 Wicklow St, Dublin 2",
    "location" : {
        "coordinates" : [ 
            -6.261246, 
            53.343889
        ],
        "type" : "Point"
    },
    "menu" : [ 
        {}
    ],
    "nReviews" : 2,
    "rating" : 5
}]

return {
  getPlaces:function(){
    return placesSample;

  },
  getDetails:function(id){
      var p = placesSample.filter(function(obj){return obj._id==id})[0];
      return p;
  }
}});
