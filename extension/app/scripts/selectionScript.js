// $(document).ready(function() {

vex.defaultOptions.className = 'vex-theme-os';

var globalGroups = [];
var username = undefined;
var test = null;

/***************************************************
    GET USERNAME FROM LOCAL STORAGE
    BY REQUESTING IT FROM BACKGROUND.JS
****************************************************/

chrome.runtime.sendMessage({
  text: 'getUsername'
}, function(response) {
  console.log(response.username);
  username = response.username;
  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:3000' + '/test/users/groups',
    data: {username: username},
    success: (data) => {
      console.log(data[0]);
      for(var i = 0; i < data.length; i++) {
        globalGroups.push(data[i].groupname);
      }
      console.log(globalGroups, 'globalGROUPS');
    },
  })
});

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

var sendComment = function (markupid, comment) {
  chrome.runtime.sendMessage({
    text: 'getUsername'
  }, function(response) {
    username = response.username;
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:3000' + '/test/comments/create',
      data: {username: username, markupid: markupid, comment: comment},
      success: (data) => {
        console.log(data, 'inside of Send Comment');
        // console.log(globalGroups, 'globalGROUPS');
      },
    })
  });
};


var elements = document.querySelectorAll("p, li, em, span, h1, h2, h3, h4, h5, td, tr, th, tbody");

// var elements = document.getElementsByTagName("*");

/***************************************************
      POST SELECTION AND SEND TO BACKGROUND.JS
****************************************************/

var postSelection = function(targetText, groups, comment) {
  var testExport = editor.exportSelection();
  console.log(testExport, 'test export');
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


// $('body').append('<script> function onClickSelectionCb () {alert("this is working")}; </script>');

$('<script>var onClickSelectionCb = function () {alert("this is working")}</' + 'script>').appendTo(document.head);

// $('<h1> hello dude </h1>').appendTo('body');

// $('.body').html('hello maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan');


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
          // $('.testClass').click(function () {
          //   alert('this is working bro');
          // });
          // postSelection(html);
          console.log('error');
          return html;
        }
      }),
      'sendSelection': new MediumButton({
        label: 'Share with All',
        start: '<span onclick="onClickSelectionCb" style="background-color: powderblue;">',
        end: '</span>',
        action: function(html, mark) {
          postSelection(html);
          return html;
        }
      }),
      'sendWithComments': new MediumButton({
        label: 'Share and Add Comment',
        start: '<span onclick="onClickSelectionCb" style="background-color: powderblue;">',
        end: '</span>',
        action: function(html, mark) {
          postSelection(html);
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


var commentPost = function (id) {

};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request, 'request');

  var allSelections = request.selection;
  console.log(allSelections, 'AllSelections', request);
  for (var i = 0; i < allSelections.length; i++) {
    if (!userSet[allSelections[i].author]) {
      userSet[allSelections[i].author] = numbers.splice(0,1);
    }
    var importedSelection = JSON.parse(allSelections[i].anchor);
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
      range.insertNode(fragment);
      if (firstInsertedNode) {
        range.setStartBefore(firstInsertedNode);
        range.setEndAfter(lastInsertedNode);
      }
      sel.removeAllRanges();
      sel.addRange(range);
    }
    $('#markupid_' + markupId).click(function () {
      addComment(markupId);
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
