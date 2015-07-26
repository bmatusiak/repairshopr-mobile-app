(function() {
/* globals requirejs */
  
  var appPath = "https://bmatusiak-bmatusiak.c9.io/p/ark2";

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