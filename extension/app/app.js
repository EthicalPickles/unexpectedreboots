
var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

var myApp = angular.module('Markable', [
  'ui.router',
  'dropdownController',
  'mainController',
  'Markable.directives'
]);


myApp.constant('__env', env);
myApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '../views/main.html',
    controller: 'main',
    authenticate: true
  })
  .state('login', {
    url: '/login',
    templateUrl: '../views/signInOrUp.html',
    controller: 'dropdown',
    authenticate: false
  });
})
.run(['$state', function ($state) {
  console.log($state);
}])
.run(function ($rootScope, $state, __env) {
  const destUrl = __env.destUrl;
  $rootScope.$on('$stateChangeStart', function (evt, toState) {

    chrome.cookies.getAll({url: destUrl + '/dashboard.html'}, function(cookie) {
      console.log('cookie:', cookie);
      if (cookie) {
        if (!cookie.length > 0) {
          if (toState.authenticate) {
            evt.preventDefault();
            $state.transitionTo('login');
          }  
        }
      }
    });
  });
});
