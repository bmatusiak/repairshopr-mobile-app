/* globals app*/
define(["events"], function(events) {

    var EventEmitter = events.EventEmitter;

    var pluginEvents = new EventEmitter();

    appPlugin.provides = ["login", "logout","user"];
    appPlugin.consumes = ["settings","mainLayout","factory"];
    return appPlugin;

    function appPlugin(options, imports, register) {
        var settings = imports.settings;

        //var domain = settings.addSetting("domain","Domain");
        //var api_key = settings.addSetting("api_key","API_KEY");
        var username = settings.addSetting("username","UserName");
        var user_data = settings.addSetting("user_data","user_data");

        var location = settings.addSetting("location","Location ID",true);

        function getApiKey(username, password, callback) {
            //done use api plugin becuase it doest have have a user_token yet!
            $.post("https://admin.repairshopr.com/api/v1/sign_in", {
                email: username,
                password: password
            }).done(function(data) {
                settings.set("location","");
                user_data(data);
                callback(null, data.user_token);
            }).fail(function(er) {
                callback(true);
            });
        }



        var plugin = {
            user:{get:function(){
                return user_data();
            }},
            login: {
                show:function (){
                     $( "#popupLogin" ).popup( "open" );
                },
                start: function() {
                    if (!user_data().user_token) pluginEvents.emit("logout");
                    else pluginEvents.emit("login");
                },
                onLogin: function(fn) {
                    if (fn) pluginEvents.on("login", fn);
                }
            },
            logout: {
                start: function(callback) {
                    if (callback) callback();
                    pluginEvents.emit("logout");
                },
                onLogout: function(fn) {
                    if (fn) pluginEvents.on("logout", fn);
                }
            }
        };

        $("#login_un").val(username());

        $("#popupLogin").submit(function(e) {
            username($("#login_un").val());
            var password = $("#login_pw").val();
            $("#login_pw").val("");
            getApiKey(username(),password,function(err,token){
                if(!err) pluginEvents.emit("login", user_data());
            });
            e.preventDefault();
            $( "#popupLogin" ).popup( "close" );
        });


        imports.mainLayout.startPanel.manager.emit("addItem",function(){
            return "Logout";
        },function(){
            plugin.logout.start();
        },true);

        var loginList = imports.factory.createList("loginList");
        loginList.manager.parent(imports.mainLayout.mainPage.manager);

        loginList.manager.emit("addItem",function(){
            return "Login";
        },function(){
            plugin.login.show();
        },true);

        plugin.login.onLogin(function () {
            imports.mainLayout.startList.manager.start();
        });

        plugin.logout.onLogout(function(){
            user_data({});
            loginList.manager.start();
            plugin.login.show();
        });





        register(null, plugin );
    }

});