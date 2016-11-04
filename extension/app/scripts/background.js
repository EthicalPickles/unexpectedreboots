chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab ) {
  if ( changeInfo.status === 'complete' ) {
    var username = localStorage.getItem('username');
    var destUrl = localStorage.getItem('destUrl');

    var tabUrl = tab.url;
    var userMarkups = [];
    if (username) {
      var tab = tabId;
      $.ajax({
        type: 'GET',
        url: destUrl + '/test/users/markups',
        data: {username: username},
        success: function(response) {
          for (var i = 0; i < response.length; i++) {
            if (tabUrl === response[i].url) {
              userMarkups.push(response[i]);
            }
          }
          if (userMarkups.length) {
            chrome.tabs.sendMessage(tab, {selection: userMarkups});
          }

          var shareGroups = localStorage.getItem('groupsToShareWith');
          if(shareGroups === null) {
            shareGroups = {};
          } else {
            shareGroups = JSON.parse(shareGroups);
          }

          for(groupID in shareGroups) {
            if(shareGroups[groupID] === true) {
              $.ajax({
                type: 'GET',
                url: destUrl + '/test/groups/markups',
                data: {groupID: groupID},
                success: function(response) {
                  var groupMarkups = [];
                  for (var x = 0; x < response[0].length; x++) {
                    if (tabUrl === response[0][x].url) {
                      groupMarkups.push(response[0][x]);
                    }
                  }

                  if (groupMarkups.length) {
                  chrome.tabs.sendMessage(tab, {selection: groupMarkups});
                  }
                }
              })
            }
          }
        }
      });
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var username = localStorage.getItem('username');
  var destUrl = localStorage.getItem('destUrl');

  if (request.text === 'getUsername') {
    sendResponse({username: username, groups: shareGroups, destUrl: destUrl});
  } else if (username) {
    var selection = request.selection;
    var url = '';
    var title = '';
    var text = request.text;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      url = tabs[0].url;
      title = tabs[0].title;

    //need url, title, and text
      $.ajax({
        type: "POST",
        url: destUrl + '/api/markups/create',
        data: {
          username: username,
          anchor: selection,
          url: url,
          title: title,
          text: request.text,
          comment: null
        },
        success: function(data) {
          var shareGroups = localStorage.getItem('groupsToShareWith');
          if(shareGroups === null) {
            shareGroups = {};
          } else {
            shareGroups = JSON.parse(shareGroups);
          }

          for(groupID in shareGroups) {
            if(shareGroups[groupID] === true) {
              $.ajax({
                type: 'POST',
                url: destUrl + '/test/markups/share',
                data: {
                  username: username,
                  anchor: selection,
                  url: url,
                  title: title,
                  text: request.text,
                  comment: null,
                  groupID: groupID,
                  markupID: data.id
                },
                success: function() {
                },
                error: function(obj,string,other) {
                 
                }
              });
            }
          }
        }
      });
    });
  }
})







