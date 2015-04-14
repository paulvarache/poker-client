// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('pokerPlanning', ['ionic', 'pokerPlaning.controllers', 'pokerPlaning.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $ionicPlatform.registerBackButtonAction(function (event) {
            event.preventDefault();
    }, 100);
  });
})

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $stateProvider

  .state('index',{
    url: "/callback/:oauth",
    controller: "IndexController"
  })

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "LoginCtrl"
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html"
  })
  .state('app.poker', {
    url: "/poker",
    views: {
      'menuContent': {
        templateUrl: "templates/poker.html",
        controller: 'MainCtrl'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
