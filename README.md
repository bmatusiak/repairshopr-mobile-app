# repairshopr-mobile-app
repairshopr-mobile-app is a app that only uses the api, and can be converted into a device app

This app uses 

*  jQuery
*  JQuery Mobile
*  c9.io architect
*  nodejs's events lib
*  requirejs


Running the project
---

to get started, download the project [here](https://github.com/bmatusiak/repairshopr-mobile-app/archive/master.zip)

1. Open directory "node-webkit".
2. click start.bat

This will open node webkit pointing local directory.

*if you use any web browser, you wont be allowd to login to repairshopr-mobile-app*


Developing the project
----


Development takes place @ c9.io, and this make it easy to collaborate with others when asking for help, you will have to know some linux terminal commands

1. Sign up with github.com if you are not a member.
2. Fork this repo
3. After sign up with github.com, navigate to [https://c9.io/auth/github?r=/dashboard.html](https://c9.io/auth/github?r=/dashboard.html), as this will allow you to login into c9.io via github.com auth.
4. In c9.io's dashboard, find the "repairshopr-mobile-app" repository and setup a project
5. use a ternimal tab to navigate to folder "node-server" and run "npm install" as this will download some things it need to serv the content
6. from the node-server directory, run "node index.js" as this will run the app.

7. with node-webkit running on you 'windows computer', open the "app/index.js" file and fix the window.location path to your running path... 
8. open "app/package.json" and fix `"node-remote": "github-raw-relay.herokuapp.com",` to your domain, as this will disable 'cross-domain-access' security for that domin
9. run "start.bat" 

if every thing is working then start coding.


Device Testing
----

Current device testing is done on "Droidscript" android

the main plan is to be able for the to be converted to phonegap (adobe's way to build for Android + iOS @ same time),

but as of currently "droidscript" is the best way to go without any overhead from phonegap, for now