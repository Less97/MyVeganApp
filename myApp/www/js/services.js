angular.module('myApp.Service', [])

.factory('LoginService', function () {
  return {
    login: function (email, password) {
      if (email == "Test@test.it" && password == "Password_123") {
        return {
          email: "Test@test.it",
          password: "Password_123",
          "firstName": "My First Name",
          "lastName": "myLastName"
        };
      } else {
        return {};
      }
    },
    createUser: function () {
      return 1;
    }
  }
})

.factory('PlacesService', function () {
    {
      var placesSample = [{
        "_id": "57fe828211652af20268d814",
        "name": "Giovinda's",
        "type": "restaurant",
        "phoneNumber": "000-000000",
        "email": "info@giovinda.it",
        "address": "4 Aungier St, Dublin 2",
        "location": {
          "coordinates": [-6.265116,
            53.34127
          ],
          "type": "Point"
        },
        "menu": [{
          "dishName": "Dish 3",
          "price": 10.5,
          "tipology": 7
        }],
        "nReviews": 5,
        "rating": 3.5
      }, {
        "_id": "5800f1c711652af20268d816",
        "name": "Umi Falafel",
        "type": "restaurant",
        "phoneNumber": "000-000000",
        "address": "13 Dame Street, Dublin 2",
        "email": "info@umifalafel.it",
        "location": {
          "coordinates": [-6.2676697,
            53.344242
          ],
          "type": "Point"
        },
        "menu": [{
          "dishName": "Dish 2",
          "price": 11.5,
          "tipology": 2
        }],
        "nReviews": 1,
        "rating": 4
      }, {
        "_id": "58034b9511652af20268d817",
        "name": "Galwy Veggie",
        "type": "restaurant",
        "email": "info@galwyVeggie.it",
        "phoneNumber": "000-000000",
        "address": "Galway Street",
        "location": {
          "coordinates": [-9.056994,
            53.273838
          ],
          "type": "Point"
        },
        "menu": [{
          "dishName": "Dish 2",
          "price": 9.5,
          "tipology": 5
        }],
        "nReviews": 1,
        "rating": 3
      }, {
        "_id": "58038b3c11652af20268d818",
        "name": "Cornucopia",
        "type": "restaurant",
        "phoneNumber": "000-000000",
        "email": "info@cornucopia.it",
        "address": "19-20 Wicklow St, Dublin 2",
        "location": {
          "coordinates": [-6.261246,
            53.343889
          ],
          "type": "Point"
        },
        "menu": [{}],
        "nReviews": 2,
        "rating": 5
      }]

      return {
        getPlaces: function () {
          return placesSample;

        },
        getDetails: function (id) {
          var p = placesSample.filter(function (obj) {
            return obj._id == id
          })[0];
          return p;
        }



      }
    }
  })
  .factory('ReviewsService', function () {
    var reviews = [{
      "_id": ObjectId("5803f2ed6f525f126c398db3"),
      "placeId": ObjectId("57fe828211652af20268d814"),
      "reviewerId": ObjectId("57fe829611652af20268d815"),
      "rating": 5,
      "description": "it was a good very dinner"
    }, {
      "_id": ObjectId("5803f3086f525f126c398db4"),
      "placeId": ObjectId("57fe828211652af20268d814"),
      "reviewerId": ObjectId("57fe829611652af20268d815"),
      "rating": 4,
      "description": "Decent"
    }, {
      "_id": ObjectId("5803f36d97364a15742712bd"),
      "placeId": ObjectId("57fe828211652af20268d814"),
      "reviewerId": ObjectId("57fe829611652af20268d815"),
      "rating": 3,
      "description": "Nah, I wouldn't go there again"
    }, {
      "_id": ObjectId("5803f39197364a15742712be"),
      "placeId": ObjectId("57fe828211652af20268d814"),
      "reviewerId": ObjectId("57fe829611652af20268d815"),
      "rating": 5,
      "description": "Amazing!"
    }, {
      "_id": ObjectId("5803f4546210e31c1cdbe2a9"),
      "placeId": ObjectId("57fe828211652af20268d814"),
      "reviewerId": ObjectId("57fe829611652af20268d815"),
      "rating": 2,
      "description": "Bleah. Never again!"
    }];

    return {
      getReviews: function (placeId) {
        return reviews;
      }
    }
  })

.factory('MenuService', function (placeId) {
  var menu = {
    "dishName": "Dish 3",
    "price": 10.5,
    "tipology": 7
  }

  return {
    getMenu: function (placeId) {
        return menu;
    }
  }
})
