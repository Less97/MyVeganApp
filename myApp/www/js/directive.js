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
  }]).directive("compareTo",function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});