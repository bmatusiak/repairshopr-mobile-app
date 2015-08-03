/* globals app */
define(function() {

  plugin.provides = ["customers"];

  plugin.consumes = ["factory", "settings", "mainLayout", "api", "customer_assets"];

  return plugin;

  function plugin(options, imports, register) {
    var settings = imports.settings;
    var factory = imports.factory;
    var api = imports.api;
    var customer_assets = imports.customer_assets;

    function formatDate(Adate) {
      var date = new Date(Adate);
      return date.toDateString() + ", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }


    var addTicket = factory.createList("addTicket");
    addTicket.manager.on("update", function(customer) {
      addTicket.manager.emit("clear");
      var item = $("<textarea/>");
      item.css("width", "100%");
      item.css("min-height", "100px");
      addTicket.manager.emit("addItem", item);
      addTicket.manager.emit("addItem", "Create Ticket", function() {
        var commentText = item.val();
        api.post("/tickets", {
          customer_id: customer.id,
          subject: "ticket subject",
          status: "New Status",
          problem_type: "some problem_type",
          comments : [{
            body: "comment body",
            subject: "comment subject"
          }]
        }, function(data) {
          console.log(data);
        }, function() {
          console.log(arguments);
        });
      });
      addTicket.manager.emit("setup");
    });
    addTicket.manager.parent(imports.mainLayout.mainPage.manager);

    /****       ****/
    var customerView = factory.createList("customerView");


    customerView.manager.on("update", function(customer) {
      customerView.manager.emit("clear");

      customerView.manager.emit("addItem", "Name: <b>" + customer.fullname + "</b>");
      customerView.manager.emit("addItem", "Email: <b>" + customer.email + "</b>");
      customerView.manager.emit("addItem", "Phone: <b>" + customer.phone + "</b>");
      customerView.manager.emit("addItem", "Phone: <b>" + customer.mobile + "</b>");
      customerView.manager.emit("addItem", "Created: <b>" + customer.created_at + "</b>");
      customerView.manager.emit("addItem", "Address: <b>" + customer.address + "<br/>" + customer.city + ", " + customer.state + " " + customer.zip + "</b>");
      customerView.manager.emit("addItem", "Location Name: <b>" + customer.location_name + "</b>");
      customerView.manager.emit("addItem", "Assets", function() {

        customer_assets.customer_assetsList.manager.emit("update", customer);
        customer_assets.customer_assetsList.manager.show();
      });
/*
      customerView.manager.emit("addItem", "Create Ticket", function() {
        addTicket.manager.emit("update", customer);
        addTicket.manager.show();
      });
*/
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
    customersList.manager.emit("addItem", customerSearchForm, false, true, true);
    var updating = false;
    var doAgain = false;
    var doUpdate = function() {
      if (!updating) {
        if(customerSearchInput.val() == ""){
          updateBasicList();
          return;
        }
        updating = true;
        customersList.manager.emit("clear");
        api.get("/customers/autocomplete", {
          query: customerSearchInput.val()
        }, function(data) {
          customersList.manager.emit("clear");
          for (var i in data.customers) {
            (function(customer) {
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

    function updateBasicList(){
      api.get("/customers", {}, function(data) {
          customersList.manager.emit("clear");
          for (var i in data.customers) {
            (function(customer) {
              customersList.manager.emit("addItem", "<b>" + data.customers[i].fullname + "</b>", function() {
                customerView.manager.emit("update", customer);
                customerView.manager.show();
              }, true);
            })(data.customers[i]);
          }
          customersList.manager.emit("setup");
        }, function() {

        }, function() {
        });
    }
    customersList.manager.on("show", function(keepData) {
      if (!keepData) {
        updateBasicList();
      }
    });

    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Customers";
    }, function() {
      customersList.manager.show();
    }, true);


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
