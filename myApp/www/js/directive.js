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
  }]).directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});