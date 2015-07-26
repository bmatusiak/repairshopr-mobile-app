/* globals app */
$(function(){
    $.mobile.loading( "show");
});
define(function() {

    appPlugin.consumes = ["factory","login","logout","mainLayout","tickets"];
    appPlugin.provides = ["main"];
    return appPlugin;

    function appPlugin(options, imports, register) {
        
        var mainPage = imports.mainLayout.mainPage;
        
        mainPage.manager.on("loading",function(){
            $.mobile.loading( "show");
        });
        mainPage.manager.on("doneLoading",function(){
            $.mobile.loading( "hide");
        });
        mainPage.manager.emit("doneLoading");
        
        
        var ticketsList = imports.tickets.ticketsListLayout;
        ticketsList.manager.parent(mainPage.manager);
        
        
        try{
            if(app){
                app.EnableBackKey(false);
                window.OnBack = function(){
                    mainPage.manager.emit("back",function(isEnd){
                        if(isEnd) app.Exit();
                    });
                };
            }
        }catch(e){}
        
        register(null,{main:{
            start:function(){
                imports.login.start();
            }
        }});
    }

});