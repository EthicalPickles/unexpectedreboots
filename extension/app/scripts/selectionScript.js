// $(document).ready(function() {

vex.defaultOptions.className = 'vex-theme-os';

var globalGroups = [];
var username = undefined;

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
      for(var i = 0; i < data.length; i++) {
        globalGroups.push(data[i].groupname);
      }
    },
  })
});


var elements = document.querySelectorAll("p, li, em, span, h1, h2, h3, h4, h5, td, tr, th, tbody");

// var elements = document.getElementsByTagName("*");
var postSelection = function(targetText) {
  var testExport = editor.exportSelection();
  console.log(testExport, targetText, 'here frank');
  chrome.runtime.sendMessage({
    action: 'add',
    selection: JSON.stringify(testExport),
    text: targetText
  }, function(response) {

  });
}

$('body').delegate('button.medium-editor-action.medium-editor-button-last', 'click', function() {
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

$('body').delegate('button.medium-editor-action.medium-editor-button-first', 'click', function() {

  var groupCheckBox = [];
  globalGroups.forEach(function (group) {
    groupCheckBox.push('<label><input type="checkbox" value="' + group + '">' + group + '</label><br>');
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
              console.log('success');
          }
      }
  })
});


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
          // postSelection(html);
          console.log('error');
          // return html;
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
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request, 'request');

  var allSelections = request.selection;
  for (var i = 0; i < allSelections.length; i++) {
    if (!userSet[allSelections[i].author]) {
      userSet[allSelections[i].author] = numbers.splice(0,1);
    }
    var importedSelection = JSON.parse(allSelections[i].anchor);
    editor.importSelection(importedSelection);

    // <a href="#" class="markable-tooltip" style="background-color: yellow;">' + getCurrentSelection() + '<span> Testing a long tooltip </a>';

    var html = '<span class="markable-tooltip"' +
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
