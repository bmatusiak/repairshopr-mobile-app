define(function() {
    var pluginName = "phonegap";


    plugin.provides = [pluginName];
    plugin.consumes = ["plugin","mainLayout"];

    return plugin;

    function plugin(options, imports, register) {

    var phonegap = !(window.global);
    if (phonegap) {
        try {
            //This is for droidscript
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "cordova.js";
            $('head').append(s);
            document.addEventListener("backbutton", function() {
                imports.mainLayout.mainPage.manager.emit("back", function(isEnd) {
                    if (isEnd) navigator.app.exitApp();
                });
            }, false);
        }
        catch (e) {

        }
    }

        (function() {
            var regObject = {};
            regObject[plugin.provides[0]] = {

            };
            register(null, regObject);
        })();

    }

});