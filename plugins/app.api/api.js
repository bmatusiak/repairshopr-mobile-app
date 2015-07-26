/* globals */
define(["events"], function(events) {
    var pluginName = "api";

    var EventEmitter = events.EventEmitter;

    plugin.provides = [pluginName];

    return plugin;

    function plugin(options, imports, register) {
        var pluginEvents = new EventEmitter();
        pluginEvents.EventEmitter = EventEmitter;

        pluginEvents.customers 

        (function() {
            var regObject = {};
            regObject[plugin.provides[0]] = pluginEvents;
            register(null, regObject);
        })();

    }

});