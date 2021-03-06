define(["architect"], function(architect) {
    console.log("Loading APP")
    architect.resolveConfig([

        "plugins/main/main",
        "plugins/main/layout",
        "plugins/factory/factory",
        "plugins/events/events",
        "plugins/settings/settings",
        "plugins/user/user",
        "plugins/tickets/tickets",
        "plugins/customers/customers",
        "plugins/customers/customer_assets",
        "plugins/api/api",
        "plugins/tools/tools",

        //"plugins/appointments/appointments",
        //"plugins/invoices/invoices",
        //"plugins/payments/payments",
        //"plugins/leads/leads",

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