/* globals app */
define(function() {

  plugin.provides = ["customers"];

  plugin.consumes = ["factory", "settings", "mainLayout", "api"];

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

      customerView.manager.emit("addItem", "Name: <b>" + customer.fullname + "</b>");
      customerView.manager.emit("addItem", "Email: <b>" + customer.email + "</b>");
      customerView.manager.emit("addItem", "Phone: <b>" + customer.phone + "</b>");
      customerView.manager.emit("addItem", "Phone: <b>" + customer.mobile + "</b>");
      customerView.manager.emit("addItem", "Created: <b>" + customer.created_at + "</b>");
      customerView.manager.emit("addItem", "Address: <b>" + customer.address + "<br/>"+customer.city+", "+customer.state+" "+customer.zip+"</b>");
      customerView.manager.emit("addItem", "Location Name: <b>" + customer.location_name + "</b>");

      customerView.manager.emit("setup");
    });

    customerView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    /****       ****/

    var customersList = factory.createList("customersList");

    var customerSearchForm = $("<form/>");
    customerSearchForm.submit(function(e) {
      e.preventDefault()
    });
    var customerSearchDiv = $("<div/>");
    customerSearchDiv.addClass("ui-input-search ui-shadow-inset ui-input-has-clear ui-body-a ui-corner-all");
    var customerSearchInput = $("<input/>");
    customerSearchForm.append(customerSearchDiv);
    customerSearchDiv.append(customerSearchInput);
    customersList.manager.emit("addItem", customerSearchForm, false, false, true);
    var updating = false;
    var doAgain = false;
    var doUpdate = function() {
      if (!updating) {
        updating = true;
        customersList.manager.emit("clear");
        api.get("/customers/autocomplete", {
          query: customerSearchInput.val()
        }, function(data) {
          customersList.manager.emit("clear");
          for (var i in data.customers) {
            (function(customer){
              customersList.manager.emit("addItem", "<b>" + data.customers[i].fullname + "</b>", function() {
                customerView.manager.emit("update", customer);
                customerView.manager.show();
              }, true);
            })(data.customers[i]);
          }
          customersList.manager.emit("setup");
        }, function() {

        }, function() {
          updating = false;
          if (doAgain) {
            doAgain = false;
            doUpdate();
          }
        });
      }
      else doAgain = true;
    }

    customerSearchInput.on("keyup", doUpdate);
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

    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Customers";
    }, function() {
      customersList.manager.show();
    },true);


    customersList.manager.parent(imports.mainLayout.mainPage.manager);
    customerView.manager.parent(imports.mainLayout.mainPage.manager);

    register(null, {
      customers: {
        customerView: customerView,
        customersList: customersList
      }
    });
  }

});

