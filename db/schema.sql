CREATE TABLE users (
  id        BIGSERIAL   PRIMARY KEY,
  username  VARCHAR(20) NOT NULL,
  email     VARCHAR(64) NOT NULL,
  password  VARCHAR(64) NOT NULL,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE groups (
  id        BIGSERIAL   PRIMARY KEY,
  name      VARCHAR(32) NOT NULL,
  owner     BIGSERIAL   references users(id) ON DELETE CASCADE,
  createdat TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE usersgroups (
  userid      BIGSERIAL   references users(id),
  groupid     BIGSERIAL   references groups(id),
  membersince TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (userid, groupid)
);

CREATE TABLE sites (
  id        BIGSERIAL    PRIMARY KEY,
  url       VARCHAR(255) NOT NULL,
  title     VARCHAR(255) NOT NULL
);

CREATE TABLE markups (
  id        BIGSERIAL     PRIMARY KEY,
  siteid    BIGSERIAL     references sites(id) ON DELETE CASCADE,
  authorid  BIGSERIAL     references users(id) ON DELETE CASCADE,
  anchor    VARCHAR(255),
  text      VARCHAR(2048) NOT NULL,
  comment   VARCHAR(2048),
  createdat TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE markupsgroups (
  markupid  BIGSERIAL references markups(id) ON DELETE CASCADE,
  groupid   BIGSERIAL references groups(id) ON DELETE CASCADE,
  PRIMARY KEY (markupid, groupid)
);

CREATE TABLE sitesgroups (
  groupid  BIGSERIAL   references groups(id) ON DELETE CASCADE,
  siteid   BIGSERIAL   references sites(id) ON DELETE CASCADE,
  sharedby BIGSERIAL   references users(id) ON DELETE CASCADE,
  sharedat TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (groupid, siteid, sharedat)
);


CREATE TABLE comments (
  id        BIGSERIAL     PRIMARY KEY,
  markupid  BIGSERIAL     references markups(id) ON DELETE CASCADE,
  authorid  BIGSERIAL     references users(id) ON DELETE CASCADE,
  comment   VARCHAR(2048),
  createdat TIMESTAMPTZ   NOT NULL DEFAULT now()
);


