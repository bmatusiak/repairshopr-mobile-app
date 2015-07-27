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
        
        window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
                var popup = $( "<div/>" );
                popup.popup();
                popup.html("<h1>Error occured</h1><hr/> " + errorMsg + "<br>" + "["+lineNumber+"]"+url);
                popup.popup("open");
                return false;
            };
            
        try{
            //This is for droidscript
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "file:///android_asset/app.js";
            $('head').append(s);
            if(app){
                console.log("droidscript detected")
                app.EnableBackKey(false);
                window.OnBack = function(){
                    mainPage.manager.emit("back",function(isEnd){
                        if(isEnd) app.Exit();
                    });
                };
                console.log("back key disabled");
                
                window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
                    var popup = $( "<div/>" );
                    popup.popup();
                    popup.html("<h1>Error occured</h1><hr/> " + errorMsg + "<br>" + "["+lineNumber+"]"+url);
                    popup.popup("open");
                    return true;
                };
                
            }
        }catch(e){ }
        
        register(null,{main:{
            start:function(){
                imports.login.start();
            }
        }});
    }

});