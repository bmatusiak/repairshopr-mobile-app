# repairshopr-mobile-app
repairshopr-mobile-app is a app that only uses the api, and can be converted into a device app

__This app uses__
*  jQuery
*  JQuery Mobile
*  c9.io architect
*  nodejs's events lib
*  requirejs

__Development stuff__
*  node-webkit
*  droidscript
*  nodejs
*  cloud9ide

Running the project
---

to get started, download the project [here](https://github.com/bmatusiak/repairshopr-mobile-app/archive/master.zip)

1. Open directory "node-webkit".
2. click start.bat

This will open node webkit pointing local directory.

*if you use any web browser, you wont be allowed to login to repairshopr-mobile-app*

# Developing the project

Development takes place @ c9.io, and this make it easy to collaborate with others when asking for help, you will have to know some linux terminal commands

1. Sign up with github.com if you are not a member.
2. Fork this repository.
3. After sign up with github.com, navigate to [https://c9.io/auth/github?r=/dashboard.html](https://c9.io/auth/github?r=/dashboard.html), as this will allow you to login into c9.io via github.com auth.
4. In c9.io's dashboard, find the "repairshopr-mobile-app" repository and setup a project
5. Use a terminal tab to navigate to folder "node-server" and run "npm install" as this will download some things it need to serve the content
6. From the node-server directory, Run "node index.js" as this will run the app.
7. With node-webkit running on you 'windows computer', Open the "app/index.js" file and fix the window.location path to your running path... 
8. Open "app/package.json" and fix __`"node-remote": "github-raw-relay.herokuapp.com",`__ to your cloud9ide sub-domain (__`project-username.c9.io`__), as this will disable __`Access-Control-Allow-Origin`__ security for that domain
9. Run "start.bat" 

If every thing is working, Then start coding inside c9.io

# Device Testing

Current device testing is done on "Droidscript" android,
the main plan is to convert to phonegap (adobe's way to build for Android + iOS @ same time),
but as of currently "droidscript" is the best way to go without any overhead from phonegap, for now

1. Install "Droidscript - Javascript IDE" on your android device
2. Open Droidscript and create a "HTML" project, and name it "repairshopr" as you will need to rename a file later
3. After crating the project just plug in your android device so project files can be transferred
4. Transfer all files(__you don't need node-webkit or node-server__) from this repository into the project folder for droidscript, this can be found over USB data,(Computer\Nexus 6\Internal storage\DroidScript\repairshopr)
5. Delete repairshopr.html
5. Rename "index.html" to "repairshopr.html", as when Droidscript runs repairshopr.html as its endpoint
6. Go into Droidscript and click on repairshipr, as this should run it

## DroidScript's __`Access-Control-Allow-Origin`__

As long as this "droidscript app" is loaded as a local file and not redirected to external page, it wont complain about __`Access-Control-Allow-Origin`__


# Things you will see in the code

If you notice __`github-raw-relay.herokuapp.com`__ is a domain used in this project, as this is a proxy that fixes content types received from github raw content

This was created for BRANCH testing. 

### Warning
BRANCH testing is experimental, testing a untrusted branch could results in stolen data and also may have unexpected results.

here is the source
```
var request = require("request");

var mime = require('mime');

var server = require('http').Server(function(req, res) {

    var type = mime.lookup(req.url);

    var x = request('https://raw.githubusercontent.com' + req.url,function(error, response, body) {
         if (response && response.headers["content-type"] == "text/plain; charset=utf-8") {
            if (type == "application/octet-stream")
                type = mime.lookup(".txt");
                
            res.writeHead(response.statusCode, {
                "Content-Type": type,
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                'Expires': '-1',
                'Pragma': 'no-cache'
            });

            res.end(body);
        }
    });

    if (type == "application/octet-stream")
        type = false;

    x.on('response', function(response) {
        if (response.headers["content-type"] !== "text/plain; charset=utf-8") {
            req.pipe(x);
            x.pipe(res);
        }
    });

});

server.listen(process.env.PORT, process.env.IP, function() {
    console.log("listening");
});
```




