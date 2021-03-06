/* globals app */
define(["events"], function(events) {
    var pluginName = "tools";

    var EventEmitter = events.EventEmitter;

    plugin.provides = [pluginName];

    return plugin;

    function plugin(options, imports, register) {
        var pluginEvents = new EventEmitter();
        pluginEvents.EventEmitter = EventEmitter;

        pluginEvents.format = {
            date: function(Adate) {
                var date = new Date(Adate);
                return date.toDateString() + ", " + (date.getHours() > 12 ? date.getHours()-12 : date.getHours()) + ":" + date.getMinutes() + ":" + date.getSeconds() + " "+(date.getHours() >= 12 ? "PM" : "AM");
            }
        };

        (function() {
            var regObject = {};
            regObject[plugin.provides[0]] = pluginEvents;
            register(null, regObject);
        })();

    }

});