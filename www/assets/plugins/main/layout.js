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

        var startListBtn  = plugin.startListBtn = $("<a/>",{class:"ui-btn-right",style:"padding: 16px 30px 0px 0px;"});
        startListBtn.html("&nbsp;");
        startListBtn.button();
        startListBtn.buttonMarkup({ icon: "gear" });
        $("#header").append(startListBtn);

        startList.manager.on("hide",function(){
            startListBtn.hide();
        });
        startList.manager.on("show",function(){
            startListBtn.show();
        });

        var mainPanel = plugin.mainPanel =factory.managePage("#mainPanel");
        var startPanel = plugin.startPanel = factory.createList("startPanel");
        startPanel.manager.parent(mainPanel.manager);
        startPanel.manager.on("itemClick",function(){
            mainPanel.panel("close");
        })
        startListBtn.click(function(){
            startPanel.manager.start();
            mainPanel.trigger( "updatelayout" );
            mainPanel.panel("open");
        })

        register(null, {
            mainLayout: plugin
        });

    }

});