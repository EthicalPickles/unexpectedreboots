angular.module('mainController', [])

.controller('main',function($scope, $http, $location) {
  $scope.testSession = function() {
    $http({ 
      method: 'GET',
      url: 'http://104.237.1.118:3000/api/groups/create',
      headers: {'Content-Type': 'application/json'}
    }).then(function(response) {
      console.log(response);
      console.log('inside testSession')
    });
    console.log('outside of post request');
  }
});