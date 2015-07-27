/* globals app*/
define(["events"], function(events) {

    var EventEmitter = events.EventEmitter;

    var pluginEvents = new EventEmitter();

    appPlugin.provides = ["login", "logout"];
    appPlugin.consumes = ["settings","mainLayout","factory"];
    return appPlugin;

    function appPlugin(options, imports, register) {
        var settings = imports.settings;
        
        var domain = settings.addSetting("domain","Domain");
        var api_key = settings.addSetting("api_key","API_KEY");
        var username = settings.addSetting("username","UserName");
        
        function getApiKey(username, password, callback) {
            $.post("https://"+domain()+".repairshopr.com/api/v1/sign_in", {
                email: username,
                password: password
            }).done(function(data) {
                callback(null, data.user_token);
            }).fail(function(er) {
                callback(true);
            });
        }
        
        var plugin = {
            login: {
                show:function (){
                     $( "#popupLogin" ).popup( "open" );
                },
                start: function() {
                    if (!api_key().length) pluginEvents.emit("logout");
                    else pluginEvents.emit("login");
                },
                check: function(fn) {
                    if (api_key() != "") fn(true, api_key);
                    else fn(false);
                },
                onLogin: function(fn) {
                    if (fn) pluginEvents.on("login", fn);
                }
            },
            logout: {
                start: function(callback) {
                    api_key("");
                    if (callback) callback();
                    pluginEvents.emit("logout");
                },
                onLogout: function(fn) {
                    if (fn) pluginEvents.on("logout", fn);
                }
            }
        };
        
        $("#login_domain").val(domain());
        $("#login_un").val(username());
        
        $("#popupLogin").submit(function(e) {
            domain($("#login_domain").val());
            username($("#login_un").val());
            var password = $("#login_pw").val();
            $("#login_pw").val("");
            getApiKey(username(),password,function(err,token){
                if(!err) pluginEvents.emit("login", api_key(token));
            });
            e.preventDefault();
            $( "#popupLogin" ).popup( "close" );
        });
        
        
        imports.mainLayout.startList.manager.emit("addItem",function(){
            return "Logout";
        },function(){
            plugin.logout.start();
        });
        
        var loginList = imports.factory.createList("loginList");
        loginList.manager.parent(imports.mainLayout.mainPage.manager);
        
        loginList.manager.emit("addItem",function(){
            return "Login";
        },function(){
            plugin.login.show();
        });
        
        plugin.login.onLogin(function () {
            imports.mainLayout.startList.manager.start();
        });
        
        plugin.logout.onLogout(function(){
            settings.set("api_key","");
            loginList.manager.start();
            plugin.login.show();
        });
        
        
        
        
        
        register(null, plugin );
    }

});