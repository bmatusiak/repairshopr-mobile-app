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

    var customer_assetView = factory.createList({id:"customer_assetView"},imports.mainLayout.mainPage);


    customer_assetView.on("update", function(customer_asset) {
      customer_assetView.clear();

      customer_assetView.addItem( "id: <b>" + customer_asset.id + "</b>");
      customer_assetView.addItem( "name: <b>" + customer_asset.name + "</b>");
      customer_assetView.addItem( "customer_id: <b>" + customer_asset.customer_id + "</b>");
      customer_assetView.addItem( "created_at: <b>" + customer_asset.created_at + "</b>");
      customer_assetView.addItem( "updated_at: <b>" + customer_asset.updated_at + "</b>");
      customer_assetView.addItem( "asset_type: <b>" + customer_asset.asset_type + "</b>");
      customer_assetView.addItem( "asset_serial: <b>" + customer_asset.asset_serial + "</b>");

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
      customer_assetView.setup();
    });

    customer_assetView.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    var customer_assetsList = factory.createList({id:"customer_assetsList"},imports.mainLayout.mainPage);

    customer_assetsList.on("update", function(customer) {
      customer_assetsList.clear();
      customer_assetsList.addItem( "<b>Loading...</b>");
      customer_assetsList.setup();
      api.get("/customer_assets", {
        customer_id: customer.id
      }, function(data) {
        customer_assetsList.clear();
        if(data.assets.length)
          for (var i in data.assets) {
            (function(asset) {
              customer_assetsList.addItem( "["+asset.asset_type+"] - <b>" + asset.name + "</b>", function() {
                customer_assetView.emit("update", asset);
                customer_assetView.show();
              });
            })(data.assets[i]);
          }
        else customer_assetsList.addItem( "<b>No Assets</b>");

        customer_assetsList.setup();
      }, function() {

      }, function() {

      });
    });

    customer_assetsList.on("show", function(keepData) {
      if (!keepData) {

      }
    });


    //customer_assetsList.manager.parent(imports.mainLayout.mainPage.manager);
    //customer_assetView.manager.parent(imports.mainLayout.mainPage.manager);

    register(null, {
      customer_assets: {
        customer_assetView: customer_assetView,
        customer_assetsList: customer_assetsList
      }
    });
  }

});
