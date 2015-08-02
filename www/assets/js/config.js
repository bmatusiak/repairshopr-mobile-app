define(["architect"], function(architect) {
    console.log("Loading APP")
    architect.resolveConfig([
        
        "plugins/main/main",
        "plugins/main/layout",
        "plugins/factory/factory",
        "plugins/events/events",
        "plugins/settings/settings",
        "plugins/login/login",
        "plugins/tickets/tickets",
        "plugins/customers/customers",
        "plugins/api/api",
        
        
    ], function(err, config) {
        if (err) {console.log(err);throw err;}
        architect.createApp(config,function(err, app) {
            if (err) {console.log(err,err.stack);throw err;}
            else app.services.main.start();
            
            console.log("Loaded APP");
        });
    });
    //Return the module value
    return function() {};
});