angular.module('mainController', ['ui.router'])

.controller('main', function($scope, $http, $location, $state, __env) {
  console.log('mainController');
  const liveUrl = __env.liveUrl;
  $scope.groups = [];
  $scope.testSession = function() {
    chrome.tabs.create({url: liveUrl + '/client/dashboard.html'})
  },
  $scope.signOut = function() {
    chrome.cookies.remove({url: liveUrl + '/client/dashboard.html', name: 'username'}, function(removedCookie) {
      console.log(removedCookie);
    });
    chrome.cookies.remove({url: liveUrl + '/', name: 'connect.sid'}, function(removedCookie) {
      console.log(removedCookie);
      localStorage.removeItem('username');
      $state.transitionTo('login');
    });
  };

  $scope.getUserGroups = function() {
    const username = localStorage.getItem('username');
    const destUrl = localStorage.getItem('destUrl');
    $.ajax({
      type: 'GET',
      url: destUrl + '/test/users/groups',
      data: {username: username},
      success: (data) => {
        console.log('GROUPS DATA', data);
        // alert(JSON.stringify(data));
        for(var i = 0; i < response.length; i++) {
          $scope.groups.push(response[i].groupname);
        }
      },
    }).fail( (data) => {
      alert(JSON.stringify(data));
      console.log('FAIL', data);
    });
  };
  $scope.getUserGroups();
});