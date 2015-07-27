/* globals app */
define(function() {

    plugin.provides = ["customers"];

    plugin.consumes = ["factory", "settings","mainLayout","api"];

    return plugin;

    function plugin(options, imports, register) {
        var settings = imports.settings;
        var factory = imports.factory;
        var api = imports.api;
        
        function formatDate(Adate) {
            var date = new Date(Adate);
            return date.toDateString() + ", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }


        /****       ****/
        var customerView = factory.createList("customerView");


        customerView.manager.on("update", function(customer) {
            customerView.manager.emit("clear");

            customerView.manager.emit("setup");
        });

        customerView.manager.on("show", function(keepData) {
            if (!keepData) {

            }
        });

        /****       ****/
        
        var customersList = factory.createList("customersList");
        
        var customerSearchForm = $("<form/>");
        var customerSearchDiv = $("<div/>");
        customerSearchDiv.addClass("ui-input-search ui-shadow-inset ui-input-has-clear ui-body-a ui-corner-all");
        var customerSearchInput = $("<input/>");
        customerSearchForm.append(customerSearchDiv);
        customerSearchDiv.append(customerSearchInput)
        customersList.manager.emit("addItem", customerSearchForm, false, false, true);
         customerSearchInput.on("change keyup",function(){
             customersList.manager.emit("clear");
             customersList.manager.emit("addItem", "<b>" +customerSearchInput.val() + "</b>");
            customersList.manager.emit("setup");
         })
        /*    
           customersList.manager.on("update", function(customer) {
                customersList.manager.emit("clear");
        
                customersList.manager.emit("setup");
            });
    
            customersList.manager.on("show", function(keepData) {
                if (!keepData) {
            
                }
            });
        */
        
        imports.mainLayout.startList.manager.emit("addItem",function(){
            return "Customers";
        },function(){
            customersList.manager.show();
        });
        

        customersList.manager.parent(imports.mainLayout.mainPage.manager);
        customerView.manager.parent(imports.mainLayout.mainPage.manager);
        

        register(null, {
            customers: {
                customerView:customerView,
                customersList:customersList
            }
        });
    }

});