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
                popup.html("<h1>Error occured</h1><hr/><div> " + errorMsg + "<br>" + "["+lineNumber+"]"+url+"</div>");
                popup.popup("open");
                return false;
            };

        var phonegap = !(window.global);
        if(phonegap){
            navigator.notification.alert(
                'repairshopr message',  // message
                alertDismissed = function alertDismissed(){
                    alertDismissed("dismissed");
                },         // callback
                'repairshopr message',            // title
                'Done'                  // buttonName
            );
            try{
                //This is for droidscript
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = "cordova.js";
                $('head').append(s);
                document.addEventListener("backbutton", function(){
                    mainPage.manager.emit("back",function(isEnd){
                        if(isEnd) navigator.app.exitApp();
                    });
                }, false);
            }catch(e){

            }
        }

        register(null,{main:{
            start:function(){
                imports.login.start();
            }
        }});
    }

});