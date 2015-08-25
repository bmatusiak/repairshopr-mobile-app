/* globals app */
$(function() {
    // $.mobile.loading( "show");
});
define(function() {

    //appPlugin.consumes = ["factory", "login", "logout", "mainLayout", "tickets"];
    appPlugin.consumes = ["hub"];
    appPlugin.provides = ["main", "plugin"];
    return appPlugin;

    function appPlugin(options, imports, register) {
        var hub = imports.hub;

        hub.on("service", function(name, service) {
            console.log("Service loaded:",name);
            plugins.push(service);
        });

        var plugins = [];

        register(null, {
            main: {
                start: function() {
                    plugins = plugins.slice(0);
                    for (var i = 0, len = plugins.length; i < len; ++i) {
                        if(plugins[i].init)
                        plugins[i].init.apply(plugins[i]);
                    }
                }
            },
            plugin: function($plugin) {
               plugins.push($plugin);
            }
        });
    }

});



// var mainPage = imports.mainLayout.mainPage;

// mainPage.manager.on("loading", function() {
//     $.mobile.loading("show");
// });
// mainPage.manager.on("doneLoading", function() {
//     $.mobile.loading("hide");
// });
// //mainPage.manager.emit("doneLoading");


// var ticketsList = imports.tickets.ticketsListLayout;
// ticketsList.manager.parent(mainPage.manager);

// window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
//     var popup = $("<div/>");
//     popup.popup();
//     popup.html("<h1>Error occured</h1><hr/><div> " + errorMsg + "<br>" + "[" + lineNumber + "]" + url + "</div>");
//     popup.popup("open");
//     return false;
// };

// document.body.addEventListener('contextmenu', function(ev) {
//     ev.preventDefault();
//     console.log(ev.toElement);
//     return false;
// });
