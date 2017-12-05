# #trackr

## Description

//TODO

### Useful links
* [Java twitter api Oauth](https://stackoverflow.com/questions/13387025/simplest-java-example-retrieving-user-timeline-with-twitter-api-version-1-1)

### Setup

I'll use the installation process like it's Linux, I've no clue how to do it on Windows

* Install Eclipse JEE (for example Oxygen), follow instructions (especially the choice of the workspace) => take care of getting a proper jdk before
* Clone the project into the eclipse workspace
* Setup the build path : add every .jar from /trackr/lib in the Build Path (right click on project =>  Build Path => Configure Build Path => Libraries => Add external jar) 
At this point you should have no errors in the ressources packages
* Say to eclipse that the project is a Dynamic Web Project => right click on project => Project Facets => tick Dynamic Web Module
* Setup the server :
  * Go to Help => Eclipse Marketplace => type Jboss and search => install Jboss Tools 4.5.1 Final
  * extract wildfly...tar.gz (tar -xvf wildfly...tar.gz) somewhere
  * Go to Windows => Preferences => Server => Runtime Environment => Add => Chose wildfly 10 => point Home Directory where you extracted wildfly...tar.gz
* Setup the database :
  * Install mysql 
  * Setup mysql : for using the database I used root user with password="password", do the same, it's specified in the files
  * Type : 
```bash
$ mysql -u root -p 
 ```
  * Put the password ("password")
  * In the mysql prompt, type "CREATE DATABASE trackr;"
  * Then type : (that step set the model into the database)
  ``` bash
  mysql -u root -p trackr < /trackr/tweetdb.sql 
  ```
* Get the configuration.properties file
* Put it on /src/ressources/config.properties
At this point you should have no error at all.
* Use the web service :
  * Go to the HashtagServlet
  * Run As => Run on server (you may have to create one, using the runtime from wildfly)
  * Now if you get http://localhost:8080/trackr/hashtag/?hashtag=tugraz you are able to get a list of Tweet objects with a lot of informations inside




