vex.defaultOptions.className = 'vex-theme-os';

var serverUrl;
var globalGroups = [];
var globalGroupIds = [];
var markupIds = [];
var username = undefined;
var groupsSelected = [];
var groupsObj = {};
var test = null;


/***************************************************
    GET COMMENTS TO BACKGROUND.JS
****************************************************/

var getComments = function (markupid) {
  console.log('this is being logged', markupid);
  $.ajax({
    type: 'POST',
    url: serverUrl + '/test/comments/get',
    data: {markupid: markupid, groupids: groupsSelected},
    success: (data) => {
      console.log(data, 'inside of get comments selection script!!!');
    },
    error: (f) => {
      console.error(f, 'here');
    }
  })
};


/***************************************************
    GET USERNAME FROM LOCAL STORAGE
    BY REQUESTING IT FROM BACKGROUND.JS
****************************************************/

chrome.runtime.sendMessage({
  text: 'getUsername'
}, function(response) {

  username = response.username;
  serverUrl = response.destUrl;

  groupsObj = JSON.parse(response.groups);

  for (var key in groupsObj) {
    groupsSelected.push(key);
  }

  console.log(markupIds, 'markupIDS', groupsSelected);

  $.ajax({
    type: 'GET',
    url: serverUrl + '/test/users/groups',
    data: {username: username},
    success: (data) => {
      console.log(data[0]);
      for(var i = 0; i < data.length; i++) {
        globalGroups.push(data[i].groupname);
        globalGroupIds.push(data[i].groupid);
      }
      markupIds.forEach((id) => getComments(id));
    },
  })
});


/***************************************************
      GET MARKUPID AND CALL SENDCOMMENT
        WITH MARKUPID AND COMMENT
****************************************************/

var addComment = function (markupid) {
  vex.dialog.open({
      message: 'Enter your comment',
      input: [
          '<input name="comment" type="text" autocomplete="off" required />'
      ].join(''),
      buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'Enter' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
      ],
      callback: function (data) {
          if (!data) {
              console.log('Cancelled');
          } else {
              // postSelection(test, data.selectGroups, data.comment);
              sendComment(markupid, data.comment);
              console.log('Comment', data.comment);
          }
      }
  })
}

/***************************************************
    SEND COMMENT TO BACKGROUND.JS
****************************************************/

var sendComment = function (markupid, comment) {
  chrome.runtime.sendMessage({
    text: 'getUsername'
  }, function(response) {
    username = response.username;
    serverUrl = response.destUrl;
    $.ajax({
      type: 'POST',
      url: serverUrl + '/test/comments/create',
      data: {username: username, markupid: markupid, comment: comment},
      success: (data) => {
        console.log(data, 'inside of Send Comment');
      },
    })
  });
};

/***************************************************
    GET COMMENTS FROM BACKGROUND.JS
****************************************************/


// var getComments = function (markupid) {
//   console.log('inside of get comments but not success!!!', globalGroupIds, markupid);
//   chrome.runtime.sendMessage({
//     text: 'getUsernameee'
//   }, function(response) {
//     $.ajax({
//         type: 'POST',
//         url: serverUrl + '/test/comments/get',
//         data: {markupid: markupid, groupids: globalGroupIds},
//         success: (data) => {
//           console.log(data, 'inside of get comments selection script!!!');
//         },
//         error: (f) => {
//           console.error(f, 'here');
//         }
//       })
//   });
// };



/***************************************************
      ADD MEDIUM-EDITOR TOOLBAR
      TO THIS LIST OF HTML ELEMENTS
****************************************************/

var elements = document.querySelectorAll("p, li, em, span, h1, h2, h3, h4, h5, td, tr, th, tbody");

// var elements = document.getElementsByTagName("*");

/***************************************************
      POST SELECTION AND SEND TO BACKGROUND.JS
****************************************************/

var postSelection = function(targetText, groups, comment) {
  var testExport = editor.exportSelection();
  // console.log(groups, comment);
  chrome.runtime.sendMessage({
    action: 'add',
    selection: JSON.stringify(testExport),
    text: targetText,
    groups: groups,
    comment: comment
  }, function(response) {

  });
}

/***************************************************
            MARKUP BUTTON FOR COMMENTS
****************************************************/

$('body').delegate('button.medium-editor-action.medium-editor-button-last', 'click', function() {
  // addComment();
  vex.dialog.open({
      message: 'Enter your comment',
      input: [
          '<input name="comment" type="text" autocomplete="off" required />'
      ].join(''),
      buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'Enter' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
      ],
      callback: function (data) {
          if (!data) {
              console.log('Cancelled');
          } else {
              console.log('Comment', data.comment);
              postSelection(test, null, data.comment);
          }
      }
  })
});

/***************************************************
          MARKUP BUTTON FOR SELECTING GROUPS
****************************************************/

$('body').delegate('button.medium-editor-action.medium-editor-button-first', 'click', function() {

  var groupCheckBox = [];
  globalGroups.forEach(function (group, index) {
    groupCheckBox.push('<label><input name="selectGroups" type="checkbox" value="' + (index + 1) + '">' + group + '</label><br>');
  });

  vex.dialog.open({
      message: 'Select all that apply',
      input: groupCheckBox.join(''),
      buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'Enter' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
      ],
      callback: function (data) {
          if (!data) {
              console.log('Cancelled');
          } else {
              postSelection(test, data.selectGroups);
              console.log('success', data.selectGroups);
          }
      }
  })
});

/***************************************************
              MARKUP TOOLBAR
****************************************************/

editor = new MediumEditor(elements, {
  anchorPreview: false,
  placeholder: false,
  disableEditing: true,
  toolbar: {
    buttons: ['sendToSelect', 'sendSelection', 'sendWithComments']
  },
  extensions: {
      'sendToSelect': new MediumButton({
        label: 'Share With Select',
        start: '<span style="background-color: powderblue;">',
        end: '</span>',
        action: function(html, mark) {
          test = html;
          console.log('error');
          return html;
        }
      }),
      'sendSelection': new MediumButton({
        label: 'Share with All',
        start: '<span style="background-color: powderblue;">',
        end: '</span>',
        action: function(html, mark) {
          postSelection(html);
          return html;
        }
      }),
      'sendWithComments': new MediumButton({
        label: 'Share and Add Comment',
        start: '<span style="background-color: powderblue;">',
        end: '</span>',
        action: function(html, mark) {
          test = html;
          // postSelection(html);
          return html;
        }
      })
    }
});

editor.subscribe('editableInput', function (event, editable) {
    // Do some work
    console.log(event, 'event');
    console.log(editable,'editable');

});

var colors = {0: '#EDE2AF', 1: '#E2BACB', 2: '#BECFE8', 3: '#F4CCB0', 4: '#BCE0B5'};
var userSet = {};
var numbers = [0,1,2,3,4]


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request, 'request');

  var allSelections = request.selection;
  console.log(allSelections, 'AllSelections', request);
  for (var i = 0; i < allSelections.length; i++) {
    if (!userSet[allSelections[i].author]) {
      userSet[allSelections[i].author] = numbers.splice(0,1);
    }
    var importedSelection = JSON.parse(allSelections[i].anchor);
    markupIds.push(allSelections[i].markupid);
    var markupId = JSON.parse(allSelections[i].markupid);

    editor.importSelection(importedSelection);

    // <a href="#" class="markable-tooltip" style="background-color: yellow;">' + getCurrentSelection() + '<span> Testing a long tooltip </a>';

    var html = '<span class="markable-tooltip"' + 'id="markupid_' + markupId + '"' +
      'style="background-color:' + colors[userSet[allSelections[i].author]] +
      ';">' + getCurrentSelection() + '<span class="markable-tooltip-popup">' + allSelections[i].author
      + '<br>' + moment(allSelections[i].createdat).twitterShort() + ' ago</span></span>';
    var sel = window.getSelection();
    var range;

    //Set new Content
    if (sel.getRangeAt && sel.rangeCount) {
      range = window.getSelection().getRangeAt(0);
      range.deleteContents();

      // Create a DocumentFragment to insert and populate it with HTML
      // Need to test for the existence of range.createContextualFragment
      // because it's non-standard and IE 9 does not support it
      if (range.createContextualFragment) {
        fragment = range.createContextualFragment(html);
      } else {
        var div = document.createElement('div');
        div.innerHTML = html;
        fragment = document.createDocumentFragment();
        while ((child = div.firstChild)) {
          fragment.appendChild(child);
        }

      }
      var firstInsertedNode = fragment.firstChild;
      var lastInsertedNode = fragment.lastChild;
      var flag = false;
      range.insertNode(fragment);
      if (firstInsertedNode) {
        range.setStartBefore(firstInsertedNode);
        range.setEndAfter(lastInsertedNode);
      }
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // getComments(markupId);

    $('#markupid_' + markupId).click(function () {
      // if (!flag) {
        console.log('inside of markup thing');
        addComment(markupId);
        // flag = true;
      // }
      // getComments(markupId);
    });
  }
});

var getCurrentSelection = function() {
  var html = '';
  var sel;
  if (typeof window.getSelection != 'undefined') {
    sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement('div');
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != 'undefined') {
    if (document.selection.type == 'Text') {
      html = document.selection.createRange().htmlText;
    }
  }
  return html;
};
