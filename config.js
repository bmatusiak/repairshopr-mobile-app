define(["architect"], function(architect) {
    architect.resolveConfig([
        
        "plugins/app.main/main",
        "plugins/app.main/layout",
        "plugins/app.factory/factory",
        "plugins/app.events/events",
        "plugins/app.settings/settings",
        "plugins/app.login/login",
        "plugins/app.tickets/tickets",
        "plugins/app.customers/customers",
        "plugins/app.api/api",
        
        
    ], function(err, config) {
        if (err) {console.log(err);throw err;}
        architect.createApp(config,function(err, app) {
            if (err) {console.log(err,err.stack);throw err;}
            else app.services.main.start();
            
        });
    });
    //Return the module value
    return function() {};
});