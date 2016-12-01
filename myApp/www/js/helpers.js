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
        return "img/pins/restaurant.png";
      },
      getListImg: function (type) {
        return "img/imgTypes/restaurant.png";
      }
    }
  })
  .factory("ResponseHelper", function ($ionicPopup) {
    return {
      handleSaveResponse: function (result,messages, callback) {
        if (result.hasOwnProperty("error") && result.error == true) {
         
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
  });
