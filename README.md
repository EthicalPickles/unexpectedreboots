[![Stories in Ready](https://badge.waffle.io/unexpectedreboots/unexpectedreboots.png?label=ready&title=Ready)](https://waffle.io/unexpectedreboots/unexpectedreboots)
*extension

to add the extension to your chrome browser, go to Settings > Extensions, check the 'Developer mode' box. Click 'Load unpacked extension...' and load the whole extension folder in the project directory

*database endpoints

// Test Routes: no authentication required

*/test/groups/create expects: {groupName, owner}  (Used in GroupPanel.jsx)
*/test/groups/add  expects: {groupID, username, newMember} (Used in UserPanel.jsx)
*/test/groups/users  expects: {groupID} (Used in UserPanel.jsx)
*/test/groups/markups expects: {groupID} (Used in MarkupPannel.jsx)
*/test/groups/sites

*/test/users/groups expects: {username}  (Used in GroupPanel.jsx)
*/test/users/markups  expects: {usename} (Used in MarkupPannel.jsx)

*/test/markups/create
*/test/markups/share

*/test/websites/create
*/test/websites/share


* The struscure of the react components that make the dashboard
![HomeView](http://dylanlrrb.github.io/HomeView.png)
![GroupView](http://dylanlrrb.github.io/GroupView.png)


#Legacy

# Setting up postgres for server

> Start up postgres
```sh
postgres -D /usr/local/var/postgres
```

>In a separate terminal and get into psql shell
```sh
createdb markable
psql markable
```
>Inside psql shell; load sql file; make user
```sh
\i db/schema.sql
CREATE USER postgres WITH PASSWORD 'markable123';
```
>Display all tables and grant permissions to user
```sh
\dt
GRANT ALL ON groups TO postgres;
GRANT ALL ON markups TO postgres;
GRANT ALL ON markupsgroups TO postgres;
GRANT ALL ON sites TO postgres;
GRANT ALL ON sitesgroups TO postgres;
GRANT ALL ON users TO postgres;
GRANT ALL ON usersgroups TO postgres;
GRANT ALL ON comments TO postgres;
```
>Superuser incase of stuff
```sh
ALTER USER postgres WITH SUPERUSER;
```
