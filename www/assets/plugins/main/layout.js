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
            mainContent.back();
        });


        var startList = plugin.startList = factory.createList({id:"startList"},mainContent);

        var startListBtn  = plugin.startListBtn = $("<a/>",{"class":"ui-btn-right",style:"padding: 16px 30px 0px 0px;"});
        startListBtn.html("&nbsp;");
        startListBtn.button();
        startListBtn.buttonMarkup({ icon: "gear" });
        $("#header").append(startListBtn);

        startList.on("hide",function(){
            startListBtn.hide();
        });
        startList.on("show",function(){
            startListBtn.show();
        });

        var mainPanel = plugin.mainPanel =factory.managePage("#mainPanel");
        var startPanel = plugin.startPanel = factory.createList({id:"startPanel"},mainPanel);
        startPanel.effect = false;
        //startPanel.parent(mainPanel.manager);
        startPanel.on("itemClick",function(){
            mainPanel.element.panel("close");
        });

        startListBtn.click(function(){
            startPanel.start();
            mainPanel.element.trigger( "updatelayout" );
            mainPanel.element.panel("open");
        });

        plugin.init = function(){

        };

        register(null, {
            mainLayout: plugin
        });

    }

});