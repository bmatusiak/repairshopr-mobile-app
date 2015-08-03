define(function() {
    var pluginName = "api";


    plugin.provides = [pluginName];
    plugin.consumes = ["settings"];

    return plugin;

    function plugin(options, imports, register) {


        var settings = imports.settings
        $.put = function(url, data, callback, type) {
            if ($.isFunction(data)) {
                type = type || callback,
                    callback = data,
                    data = {}
            }

            return $.ajax({
                url: url,
                type: 'PUT',
                success: callback,
                data: data,
                contentType: type
            });
        }

        var api = {
            get:function(location,data,done,fail,always){
                data.api_key = settings.get("api_key");
                $.get("https://"+settings.get("domain")+".repairshopr.com/api/v1"+location, data).done(done).fail(fail).always(always);
            },
            put:function(location,data,done,fail,always){
                data.api_key = settings.get("api_key");
                $.put("https://"+settings.get("domain")+".repairshopr.com/api/v1"+location, data).done(done).fail(fail).always(always);
            },
            post:function(location,data,done,fail,always){
                data.api_key = settings.get("api_key");
                $.post("https://"+settings.get("domain")+".repairshopr.com/api/v1"+location, data).done(done).fail(fail).always(always);
            }
        };

        api.customers = function(done,fail,always){
            api.get("/customers",done,fail,always);
        };

        api.customer = function(id,done,fail,always){
            api.get("/customers/"+id,done,fail,always);
        };

        api.tickets = function(data,done,fail,always){
            api.get("/tickets",data,done,fail,always);
        };

        api.ticket = function(number,done,fail,always){
            api.get("/tickets",{
                number:number
            },done,fail,always);
        };


        (function() {
            var regObject = {};
            regObject[plugin.provides[0]] = api;
            register(null, regObject);
        })();

    }

});