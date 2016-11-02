angular.module('dropdownController', [])

.controller('dropdown', function($scope, $http, $location, $state, __env) {
  $scope.signinMode = true;
  $scope.signupMode = false;
  $scope.usernamePattern = '^$|^[a-z]+[A-Za-z0-9_-.]+';
  $scope.showError = false;

  const destUrl = __env.destUrl;
  localStorage.setItem('destUrl', destUrl);

  $scope.signUp = function() {

    $http({ 
      method: 'POST',
      url: destUrl + '/api/users/register',
      params: {
        email: $scope.email, 
        username: $scope.username, 
        password: $scope.password
      },
      headers: {'Content-Type': 'application/json'}
    }).then(function(response) {
      console.log('then statement sign up', response);
      if (response.data) {
        chrome.cookies.set({
          url: destUrl + '/dashboard.html',
          name: 'username',
          value: $scope.username
        }, function(cookies) {
          console.log(cookies);
        });
        localStorage.setItem('username', $scope.username);
        $state.transitionTo('home');
      }
    });
  };

  $scope.showSection = function (section) {
    if (section === 'login') {
      $scope.signinMode = true;
      $scope.signupMode = false;
    } else {
      $scope.signinMode = false;
      $scope.signupMode = true;
    }
  };

  $scope.logIn = function() {

    $http({ 
      method: 'POST',
      url: destUrl + '/api/users/login',
      params: {
        username: $scope.username, 
        password: $scope.password
      },
      headers: {'Content-Type': 'application/json'} 
    }).then(function(response) {
      console.log('then statement logIn', response);
      if (response.data === true) {
        $scope.showError = false;
        localStorage.setItem('username', $scope.username);
        chrome.cookies.set({
          url: destUrl + '/dashboard.html',
          name: 'username',
          value: $scope.username
        }, function(cookies) {
          console.log(cookies);
        });
        $state.transitionTo('home');
      } else {
        $scope.password = '';
        $scope.showError = true;
      }
    })
  };
});



