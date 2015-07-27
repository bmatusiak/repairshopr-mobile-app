(function() {
/* globals requirejs */
  
  //var appPath = "https://github-raw-relay.herokuapp.com/bmatusiak/repairshopr-mobile-app/master";
  //var appPath = "https://project-username.c9.io";
  var appPath = false;

if(appPath)
  requirejs.config({
    waitSeconds: 200,
    "baseUrl": appPath+"/lib",
    "paths": {
      "root": appPath,
      "plugins": appPath+"/plugins"
    }
    }
  );
else 
  requirejs.config({
    waitSeconds: 200,
    "baseUrl": "lib",
    "paths": {
      "root": "../js",
      "plugins": "../assets/plugins"
    }
    }
  );
  
  requirejs(["root/config"]);

})();