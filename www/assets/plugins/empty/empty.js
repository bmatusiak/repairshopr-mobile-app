define(function() {
    var pluginName = "empty";


    plugin.provides = [pluginName];
    plugin.consumes = ["plugin"];
    return plugin;

    function plugin(options, imports, register) {

        (function() {
            var regObject = {};
            regObject[plugin.provides[0]] = {

            };
            register(null, regObject);
        })();

    }

});