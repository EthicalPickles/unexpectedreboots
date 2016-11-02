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
        var storageObj = localStorage.getItem('groupsToShareWith');
        if (storageObj === null) {
          storageObj = {};
        } else {
          storageObj = JSON.parse(storageObj);
        }
        $scope.groups = [];
        for(var i = 0; i < data.length; i++) {
          storageObj[data[i].groupid] === true ? $scope.groups.push([data[i].groupname, data[i].groupid, true]) : $scope.groups.push([data[i].groupname, data[i].groupid, false]);
        }
        $scope.$apply();
      },
    }).fail( (data) => {
      console.log('FAIL', data);
    });
  };


  $scope.getUserGroups();

  $scope.checkboxChanged = function(group, checked) {
    var storageObj = localStorage.getItem('groupsToShareWith');
    if (storageObj === null) {
      storageObj = {};
    } else {
      storageObj = JSON.parse(storageObj);
    }
    if(checked === true) {
      storageObj[group[1]] = true;
    } else {
      storageObj[group[1]] = false;
    }
    localStorage.setItem('groupsToShareWith', JSON.stringify(storageObj));
  };
});