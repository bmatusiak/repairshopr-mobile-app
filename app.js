(function() {
/* globals requirejs */
  
  var appPath = "https://github-raw-relay.herokuapp.com/bmatusiak/repairshopr-mobile-app/master";

  requirejs.config({
    waitSeconds: 200,
    "baseUrl": appPath+"/lib",
    "paths": {
      "root": appPath,
      "plugins": appPath+"/plugins"
    }
    }
  );

  requirejs(["root/config"]);

})();