# #trackr

## Description

Project for the Web Technology course in TUGraz.
The #trackr app plots tweets for a specific hashtag (and optionally a specific location and date) on a world map to allow users to identify geographical trends in Twitter data.

### Git Repo

The source code for this project is available at https://github.com/ofaucoz/trackr.

### Setup

* Install Java 1.8 JDK
* Install Eclipse JEE (the latest release)
* Clone the project's Git repo (master branch) into the eclipse workspace
* Setup the build path : add every .jar from /trackr/lib in the Build Path (right click on project => Build Path => Configure Build Path => Libraries => Add external jar)
* Right click on Project => Project Facets => tick Dynamic Web Module
* Setup the server :
  * Go to Help => Eclipse Marketplace => type Jboss and search => install Jboss Tools 4.5.1 Final
  * Download Wildfly 10 and extract the file to a folder
  * Go to Windows => Preferences => Server => Runtime Environment => Add => choose Wildfly 10 => point Home Directory where you extracted the Wildfly file
* Setup the database :
  * Install MySQL Server (we used version 5.7)
  * Setup MySQL : for using the database we used root user with password="password", do the same as it's specified in the files (obviously do not use this for a publicly available implementation, as this is a security risk!)
  * In a bash shell or command prompt:
```bash
$ mysql -u root -p
 ```
  * Enter the password ("password")
  * In the mysql prompt, type "CREATE DATABASE trackr;"
  * Then type : (this sets up the model in the database)
  ``` bash
  mysql -u root -p trackr < /trackr/tweetdb.sql
  ```
* Create a config.properties file using your own Twitter API key (not on Github for security reasons). It should contain the following entries: consumerKey, consumerSecret, accessToken and accessTokenSecret. Put it at the address /src/ressources/config.properties
* Use the web service :
  * Go to the HashtagServlet
  * Run As => Run on server (on the first run you will need to create one using the Wildfly runtime)
  * Load http://localhost:8080/trackr/ in a browser to use the web app

### Character Encoding Issues

Please note: there are currently character encoding issues with emoji and certain other non-Latin Unicode characters in the MySQL DB on Windows. If you encounter a SQLException error when making searches on the server, please **uncomment line 242** and **replace lines 283 - 289** in src/ressources/TwitterBuilder.java with the following code:

```
try {
			session.saveOrUpdate(u);
			session.saveOrUpdate(e);
			session.saveOrUpdate(c);
			session.saveOrUpdate(t);
			session.getTransaction().commit();
			session.clear();
			listTweet.add(t);
}
catch(GenericJDBCException exception) {
			System.out.println(exception.getStackTrace());
			session.getTransaction().rollback();
			session.clear();
}
```

Note that this patch is OS-independent, so will also work if you encounter this error on Linux.


### Usage

Requests are intended to be made via the web app UI, but you can also view the raw JSON by a http get request to http://localhost:8080/trackr/search.

Parameters :
* hashtag
* longitude
* latitude
* radius
* date

Example : http://localhost:8080/trackr/search?latitude=47.076668&longitude=15.421371&radius=1mi&hashtag=tugraz
Will get the tweets around TU Graz coordinates with a 1 mile radius and tugraz as hashtag.
