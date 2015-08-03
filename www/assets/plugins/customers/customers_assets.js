/* globals app */
define(function() {

  plugin.provides = ["customer_assets"];

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
    var customer_assetView = factory.createList("customer_assetView");


    customer_assetView.manager.on("update", function(customer_asset) {
      customer_assetView.manager.emit("clear");

      customer_assetView.manager.emit("addItem", "Name: <b>" + customer_asset.fullname + "</b>");
      customer_assetView.manager.emit("addItem", "Email: <b>" + customer_asset.email + "</b>");
      customer_assetView.manager.emit("addItem", "Phone: <b>" + customer_asset.phone + "</b>");
      customer_assetView.manager.emit("addItem", "Phone: <b>" + customer_asset.mobile + "</b>");
      customer_assetView.manager.emit("addItem", "Created: <b>" + customer_asset.created_at + "</b>");
      customer_assetView.manager.emit("addItem", "Address: <b>" + customer_asset.address + "<br/>" + customer_asset.city + ", " + customer_asset.state + " " + customer_asset.zip + "</b>");
      customer_assetView.manager.emit("addItem", "Location Name: <b>" + customer_asset.location_name + "</b>");

      customer_assetView.manager.emit("setup");
    });

    customer_assetView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    /****       ****/

    var customer_assetsList = factory.createList("customer_assetsList");

    customer_assetsList.manager.on("update", function(customer) {
      customer_assetsList.manager.emit("clear");
      api.get("/customer_assets", {
        customer_id: customer.customer_id
      }, function(data) {
        customer_assetsList.manager.emit("clear");
        for (var i in data.customer_assets) {
          (function(customer_asset) {
            customer_assetsList.manager.emit("addItem", "<b>" + data.customer_assets[i].name + "</b>", function() {
              customer_assetView.manager.emit("update", customer_asset);
              customer_assetView.manager.show();
            }, "dont setup");
          })(data.customer_assets[i]);
        }
        customer_assetsList.manager.emit("setup");
      }, function() {

      }, function() {
        updating = false;
        if (doAgain) {
          doAgain = false;
          doUpdate();
        }
      });
      customer_assetsList.manager.emit("setup");
    });

    customer_assetsList.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });


    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Customer Assets";
    }, function() {
      customer_assetsList.manager.show();
    },true);


    customer_assetsList.manager.parent(imports.mainLayout.mainPage.manager);
    customer_assetView.manager.parent(imports.mainLayout.mainPage.manager);

    register(null, {
      customer_assets: {
        customer_assetView: customer_assetView,
        customer_assetsList: customer_assetsList
      }
    });
  }

});
