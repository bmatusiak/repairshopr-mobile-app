define(["architect"], function(architect) {
    console.log("Loading APP")
    architect.resolveConfig([

        "plugins/main/main",
        "plugins/main/layout",
        "plugins/factory/factory",
        "plugins/events/events",
        "plugins/phonegap/phonegap",
        "plugins/settings/settings",
        "plugins/user/user",

        "plugins/tools/tools",
        "plugins/api/api",

        "plugins/customers/customers",
        "plugins/customers/customer_assets",

        "plugins/tickets/tickets",


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