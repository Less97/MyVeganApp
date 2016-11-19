angular.module("myApp.Widgets", [])
  .directive("myStaticMap", ['$window', function ($parse, $window) {
    var width = window.innerWidth - 55;
    return {
      template: '<img src="https://maps.googleapis.com/maps/api/staticmap?center={{lat}}},{{lng}}&markers=color:red%7C{{lat}},{{lng}}&zoom=12&size=' + width + 'x150&key=AIzaSyDIILGDLIQU2DlGzBbw4smp1WErV5QKpB0"/>',
      scope: {
        lat: '=lat',
        lng: '=lng',
        width: '=width'
      }
    }
  }])
  .directive("myGalleryItem", ['$window', function ($parse, $window) {

    var myWidth = (window.innerWidth - 30) + 'px';
    var myHeight = (window.innerHeight - 50) + 'px';
    return {
      replace: true,
      scope: {
        src: "&imgPath"
      },
      link: function (scope, element, attrs, controllers) {
        element.css({
          height: myHeight,
          width: myWidth,
          'background-image': 'url("' + attrs.imgpath + '")',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
          'margin':'0 auto',
          display:'block'
        })
      },
    };
  }])
  .directive("compareTo", function () {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function (scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function (modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function () {
          ngModel.$validate();
        });
      }
    };
  });
