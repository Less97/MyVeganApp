// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'myApp.Controllers', 'myApp.Service'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'views/tabs.html'
  })

  // Each tab has its own nav history stack:
.state('login', {
    url: '/login',
        templateUrl: 'views/login.html',
        controller:'LoginCtrl'
    })

.state('forgotPassword', {
    url: '/forgotPassword',
    templateUrl: 'views/forgotPassword.html',
    controller:'ForgotPasswordCtrl'
    })

.state('register',{
    templateUrl: 'views/register.html',
    controller:'RegisterCtrl'
})

.state('details',{
    url:'/details/{id}',
    templateUrl: 'views/details.html',
    controller:'DetailsCtrl'
})


  .state('tab.map', {
    url: '/map',
    views: {
      'tabAroundyou': {
        templateUrl: 'views/map.html',
        controller: 'AroundYouCtrl'
      }
    }
  })

   .state('tab.list', {
    url: '/list',
    views: {
      'tabList': {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl'
      }
    }
  })

  .state('add', {
      url: '/add',
      views: {
        'tabAdd': {
          templateUrl: 'views/add.html',
          controller: 'AddCtrl'
        }
      }
    })

   .state('tab.info', {
    url: '/info',
    views: {
      'tabInfo': {
        templateUrl: 'views/info.html',
        controller: 'InfoCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tabAccount': {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
