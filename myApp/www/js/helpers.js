angular.module('myApp.Helpers', [])
  .factory("LoadingHelper", function ($ionicLoading) {
    return {
      show: function () {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
      },
      hide: function () {
        $ionicLoading.hide();
      }
    }
  })
  .factory("ImageHelper", function () {
    return {
      getPinIcon: function (type) {
        switch(type){
          case "restaurant":
            return "img/pins/restaurant.png";
          case "cafe":
            return "img/pins/cafe.png";
          case "shop":
            return "img/pins/shop.png";
          case "food truck":
            return "img/pins/foodtruck.png";
          case "market":
            return ""
        }
      },
      getListImg: function (type) {
        
        switch(type){
          case "restaurant":
             return "img/imgTypes/restaurant.png";
          case "cafe":
             return "img/imgTypes/cafe.png";
          case "shop":
             return "img/imgTypes/shop.png";
          case "food truck":
            return "img/imgTypes/foodtruck.png";
          case "market":
            return ""
        }
      }
    }
  })
  .factory("ResponseHelper", function ($ionicPopup) {
    return {
      handleSaveResponse: function (result, messages, callback) {
        if (result.hasOwnProperty("Error") && result.Error == true) {

          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: messages.errorText
          });

          alertPopup.then(function (res) {
            callback()
          });


        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: messages.successText
          });

          alertPopup.then(function (res) {
            callback()
          });
        }
      },
      handleResponse:function(result,messages,callbackSuccess,callbackFailed){

         if (result.hasOwnProperty("error")&&result.error == true) {

          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: messages.errorText
          });

          alertPopup.then(function (res) {
            callbackFailed()
          });
        }else{
          callbackSuccess();
        }
      }

    }
  })
  .factory("PopupHelper", function ($ionicPopup) {
    return {
      showError: function (messages, callback) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: messages.errorText
        });
        alertPopup.then(function (res) {
          callback()
        });
      }

    }

  })
