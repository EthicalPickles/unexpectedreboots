var pg = require('pg');
var Pool = require('pg').Pool;
var Promise = require('es6-promise').Promise;
var users = require('./users');
var websites = require('./websites');

var CONFIG = {
  host: 'localhost',
  user: 'postgres',
  password: 'markable123',
  database: 'markable'
};

var pool = new Pool(CONFIG);


exports.createMarkup = function(siteid, authorid, anchor, text, comment, callback) {
  pool.query({
    // insert into markups
    text: 'INSERT INTO markups(siteid, authorid, anchor, text, comment) \
      VALUES($1, $2, $3, $4, $5) \
      RETURNING *', 
    values: [siteid, authorid, anchor, text, comment]
  }, function(err, rows) {
    err ? callback(err, null) : callback(null, rows.rows[0]);
  });
};


exports.createMarkupGroup = function(markupid, groupid, callback){
  pool.query({
    // insert shared markup into markupsgroups
    text: 'INSERT INTO markupsgroups(markupid, groupid) \
      VALUES($1, $2)',
      values: [markupid, groupid]
  },
  function(err, rows) {
    err ? callback(err, null) : callback(null, rows.rows[0]);
  });
};


exports.share = function(url, title, username, anchor, text, comment, groupid, callback) {

  console.log('~~~ Sharing public markup:', text, 'by username:', username, 'on site:', url, title, 'with the following comment:', comment, 'with groupID:', groupID, '~~~');

  users.getUserByName(username, (err, user) => {
    var authorid = user.id;
    websites.site(url, title, function(err, site) {
      if (err) {
        callback(err, null);
      } else {
        var siteid = site.id;
        exports.createMarkup(siteid, authorid, anchor, text, comment, function(err, markup) {
          if (err) {
            callback(err, null);
          } else {
            var markupid = markup.id;
            exports.createMarkupGroup(markupid, groupid, callback);
          }
        });
      }
    });
  });
};



// exports.shareLegacy = function(url, title, username, anchor, text, comment, groupID, callback) {

//   console.log('~~~ Sharing public markup:', text, 'by username:', username, 'on site:', url, title, 'with the following comment:', comment, 'with groupID:', groupID, '~~~');

//   var authorID;
//   var siteID;
//   var markupID;

//   users.getUserByName(username, (err, user) => {
//     authorID = user.id;
//     pool.query({
//           // find site with same URL and title
//           text: 'SELECT * FROM sites \
//             WHERE url = \'' + url + '\' \
//             AND title = \'' + title + '\';'
//         },

//         function(err2, rows2) {
//           if (err2) {
//             callback(err2, null);
//           } else {
//             if (rows2.rowCount > 0) {
//               siteID = rows2.rows[0].id;

//               pool.query({
//                 // insert into markups
//                 text: 'INSERT INTO markups(siteid, authorid, anchor, text, comment) \
//                   VALUES($1, $2, $3, $4, $5) \
//                   RETURNING *', 
//                 values: [siteID, authorID, anchor, text, comment]
//               },

//               function(err3, rows3) {
//                 if (err3) {
//                   callback(err3, null);
//                 } else {

//                   markupID = rows3.rows[0].id;

//                   pool.query({
//                     // insert shared markup into markupsgroups
//                     text: 'INSERT INTO markupsgroups(markupid, groupid) \
//                       VALUES($1, $2)',
//                       values: [markupID, groupID]
//                   },

//                   function(err4, rows4) {
//                     err4 ? callback(err4, null) : callback(null, true);
//                   });
//                 }
//               });

//             } else {

//               pool.query({
//                 // insert site into the sites table
//                 text: 'INSERT INTO sites(url, title) \
//                   VALUES($1, $2) \
//                   RETURNING *',
//                 values: [url, title]
//               },

//               function(err5, rows5) {
//                 if (err5) {
//                   callback(err5, null);
//                 } else {

//                   siteID = rows5.rows[0].id;

//                   pool.query({
//                     // insert into markups
//                     text: 'INSERT INTO markups(siteid, authorid, anchor, text, comment) \
//                       VALUES($1, $2, $3, $4, $5) \
//                       RETURNING *', 
//                     values: [siteID, authorID, anchor, text, comment]
//                   },

//                   function(err6, rows6) {
//                     if (err6) {
//                       callback(err6, null);
//                     } else {
                      
//                       markupID = rows6.rows[0].id;

//                       pool.query({
//                         // insert shared markup into markupsgroups
//                         text: 'INSERT INTO markupsgroups(markupid, groupid) \
//                           VALUES($1, $2)',
//                           values: [markupID, groupID]
//                       },

//                       function(err7, rows7) {
//                         err7 ? callback(err7, null) : callback(null, true);
//                       });
//                     }
//                   });
//                 }
//               })
//             }
//           }
//         });
//       }
//   });
// }

exports.deleteMarkup = function(markupid, callback) {
  //first delete all the markupgroup entries
  pool.query({
    text: 'DELETE FROM markups WHERE id = ' + markupid + ';'
  },
  function(err, success) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, true);
    }
  });
}