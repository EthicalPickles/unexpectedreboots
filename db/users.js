var pg = require('pg');
var Pool = require('pg').Pool;
var Promise = require('es6-promise').Promise;

var CONFIG = {
  host: 'localhost',
  user: 'postgres',
  password: 'markable123',
  database: 'markable'
};

var pool = new Pool(CONFIG);

exports.insert = function(username, email, password, callback) {

  pool.query({
    text: 'SELECT username FROM users \
      WHERE username = \'' + username + '\';'
  }, 

  function(err, rows) {
    console.log('ROWS ', rows);
    if (rows.rowCount > 0) {
      callback('user already exists', null);
    } else {

      pool.query({
        text: 'INSERT INTO users(username, email, password) \
          VALUES($1, $2, $3)',
        values: [username, email, password]
      },

      function(err, success) {
        err ? callback(err, null) : callback(null, true);
      });
    }
  });
};

exports.check = function(username, password, callback) {

  pool.query({
    text: 'SELECT username, password FROM users \
      WHERE username = \'' + username + '\';'
  },

  function(err, success) {
    err ? callback(err, null) : callback(null, success);
  });
};

exports.update = function(username, password, newPassword, email, newEmail, callback) {
  // TODO: implement user updating
}


exports.getGroups = function(username, callback) {

  pool.query({
    // find all groups user is a part of (and their owners)
    text: 'SELECT u.id AS userid, g.id AS groupid, g.name AS groupname, \
      g.owner AS groupowner, g.createdat AS createdat \
      FROM users u \
      LEFT JOIN usersgroups ug \
      ON u.id = ug.userid \
      LEFT JOIN groups g \
      ON g.id = ug.groupid \
      WHERE userid IN ( \
        SELECT u.id FROM users u \
        WHERE u.username = \'' + username + '\' \
      );'
  }, 

  function(err, rows) {
    if (err) {
      callback(err, null);
    } else {
      if (rows.rowCount === 0) {
        callback('user is not part of any groups', null);
      } else {
        callback(null, rows.rows);
      }
    }
  });
};

exports.getMarkups = function(username, callback) {

  pool.query({
    text:
      'SELECT u2.username AS author, \
        s2.title AS title, \
        s2.url AS url \
        anchor, text, comment, temp.createdat \
      FROM ( \
        SELECT m.authorid AS authorid, \
          m.siteid AS siteid, \
          m.anchor AS anchor, \
          m.text AS text, \
          m.comment AS comment, \
          m.createdat AS createdat \
        FROM markups m \
        WHERE m.authorid IN ( \
          SELECT u.id FROM users u \
          WHERE u.username = \'' + username + '\' \
        ) \
      ) temp LEFT JOIN users u2 \
      ON temp.authorid = u2.id \
      LEFT JOIN sites s2 \
      ON temp.siteid = s2.id;'
  },

  function(err, rows) {
    if (err) {
      callback(err, null);
    } else {
      if (rows.rowCount === 0) {
        callback('no markups found for this user', null);
      } else {
        callback(null, rows.rows);
      }
    }
  });
};
