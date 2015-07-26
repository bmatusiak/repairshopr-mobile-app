/* globals app */
define(function(events) {
    var pluginName = "mainLayout";
    var EventEmitter = events.EventEmitter;
    plugin.provides = [pluginName];
    plugin.consumes = ["factory"];
    return plugin;

    function plugin(options, imports, register) {

        var plugin = {};

        var factory = imports.factory;
        
        var mainContent = plugin.mainPage = factory.managePage("#mainContent");
        
        $("#back").click(function(e) {
            mainContent.manager.emit("back");
        });
        
        
         var startList = plugin.startList = factory.createList("startList");
        startList.manager.parent(mainContent.manager);
        
        
        register(null, {
            mainLayout: plugin
        });

    }

});