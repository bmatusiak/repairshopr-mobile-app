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

    var customer_assetView = factory.createList("customer_assetView");


    customer_assetView.manager.on("update", function(customer_asset) {
      customer_assetView.manager.emit("clear");

      customer_assetView.manager.emit("addItem", "id: <b>" + customer_asset.id + "</b>");
      customer_assetView.manager.emit("addItem", "name: <b>" + customer_asset.name + "</b>");
      customer_assetView.manager.emit("addItem", "customer_id: <b>" + customer_asset.customer_id + "</b>");
      customer_assetView.manager.emit("addItem", "created_at: <b>" + customer_asset.created_at + "</b>");
      customer_assetView.manager.emit("addItem", "updated_at: <b>" + customer_asset.updated_at + "</b>");
      customer_assetView.manager.emit("addItem", "asset_type: <b>" + customer_asset.asset_type + "</b>");
      customer_assetView.manager.emit("addItem", "asset_serial: <b>" + customer_asset.asset_serial + "</b>");

      /*
        id:
        name:
        customer_id:
        created_at:
        updated_at:
        properties: {
          Make:
          Model:
          Service Tag:
        }
        asset_type:
        asset_serial:
      */
      customer_assetView.manager.emit("setup");
    });

    customer_assetView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    var customer_assetsList = factory.createList("customer_assetsList");

    customer_assetsList.manager.on("update", function(customer) {
      customer_assetsList.manager.emit("clear");
      customer_assetsList.manager.emit("addItem", "<b>Loading...</b>");
      customer_assetsList.manager.emit("setup");
      api.get("/customer_assets", {
        customer_id: customer.id
      }, function(data) {
        customer_assetsList.manager.emit("clear");
        if(data.assets.length)
          for (var i in data.assets) {
            (function(asset) {
              customer_assetsList.manager.emit("addItem", "["+asset.asset_type+"] - <b>" + asset.name + "</b>", function() {
                customer_assetView.manager.emit("update", asset);
                customer_assetView.manager.show();
              });
            })(data.assets[i]);
          }
        else customer_assetsList.manager.emit("addItem", "<b>No Assets</b>");

        customer_assetsList.manager.emit("setup");
      }, function() {

      }, function() {

      });
    });

    customer_assetsList.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });


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
