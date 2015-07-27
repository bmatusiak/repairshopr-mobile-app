/* globals */
define(function () {
    var pluginName = "settings";
    plugin.provides = [pluginName];
    plugin.consumes = ["events","factory","mainLayout"];
    return plugin;
    function plugin(options, imports, register) {
        var tag = options.tag || "app";
        
        var EventEmitter = imports.events.EventEmitter;
        var pluginEvents = new EventEmitter();
        
        
        pluginEvents.get = function(id,callback){
            
            var text = localStorage.getItem(tag+"_"+id);
            if(text){
                var value = JSON.parse(text).value;
                if(callback)
                    callback(value);
                else return value;
            }else {
                if(callback)
                    callback(null);
                else return null;
            }
        };
        
        pluginEvents.set = function(id,value,callback){
            localStorage.setItem(tag+"_"+id, JSON.stringify({value:value}));
            if(callback)
                callback(value);
            else return value;
        };
        
        
        pluginEvents.on("set",pluginEvents.set);
        
        pluginEvents.on("get",pluginEvents.get);
        
        var settingsList = imports.factory.createList("settingsList");
        
        settingsList.manager.parent(imports.mainLayout.mainPage.manager);
        
        settingsList.on("show",function(){
            settingsList.manager.emit("setup");
        });
        
        pluginEvents.addSetting = function(settingName,settingAbbr,editable){
            //add location id to settings panel
            settingsList.manager.emit("addItem",function(){
                return settingAbbr+" - "+pluginEvents.get(settingName);
            },(editable ? function() {
                var mewLocation = prompt( "Set "+settingAbbr+":",pluginEvents.get(settingName));
                if(mewLocation !== null)
                    pluginEvents.set(settingName,mewLocation);
                settingsList.manager.emit("setup");
            } : undefined));
            
            (pluginEvents.get(settingName) || pluginEvents.set(settingName,""));
            
            return function function_name(arg) {
                if(arg) return pluginEvents.set(settingName,arg);
                else return pluginEvents.get(settingName);
                    
            } 
        };
        
        
        //add location id to settings panel
        pluginEvents.addSetting("location","Location ID",true);
        
        //add settings item to main layout
        imports.mainLayout.startList.manager.emit("addItem","Settings",function() {
            settingsList.manager.show();
        });
        
        (function() {
           var regObject = {}; regObject[pluginName] = pluginEvents; register(null, regObject); 
        })();
        
    }

});