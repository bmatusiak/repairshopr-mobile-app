/* globals app */
define(function() {

  plugin.provides = ["payments"];

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
    var paymentsView = factory.createList("paymentsView");


    paymentsView.manager.on("update", function(payment) {
      paymentsView.manager.emit("clear");

      paymentsView.manager.emit("addItem", "id: <b>" + payment.id + "</b>");
      paymentsView.manager.emit("addItem", "created_at: <b>" + payment.created_at + "</b>");
      paymentsView.manager.emit("addItem", "updated_at: <b>" + payment.updated_at + "</b>");
      paymentsView.manager.emit("addItem", "success: <b>" + payment.success + "</b>");
      paymentsView.manager.emit("addItem", "payment_amount: <b>" + payment.payment_amount + "</b>");
      paymentsView.manager.emit("addItem", "invoice_ids: <b>" + payment.invoice_ids + "</b>");
      paymentsView.manager.emit("addItem", "ref_num: <b>" + payment.ref_num + "</b>");
      paymentsView.manager.emit("addItem", "applied_at: <b>" + payment.applied_at + "</b>");
      paymentsView.manager.emit("addItem", "payment_method: <b>" + payment.payment_method + "</b>");
      paymentsView.manager.emit("addItem", "transaction_response: <b>" + payment.transaction_response + "</b>");

      /*
       {
          id:
          created_at:
          updated_at:
          success:
          payment_amount:
          invoice_ids:[id]
          ref_num:
          applied_at:
          payment_method:
          transaction_response:
       }
      */
      paymentsView.manager.emit("setup");
    });

    paymentsView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    /****       ****/

    var paymentsList = factory.createList("paymentsList");

    function paymentsList_OnTouch(payment) {

        paymentsView.manager.emit("update", payment);
        paymentsView.manager.show(payment);
    }

    paymentsList.manager.on("update", function(payments) {
      paymentsList.manager.emit("clear");
      for (var j in payments) {
        var payment = payments[j];

        paymentsList.manager.emit("addItem", "<b>" + payment.id + " - ["+payment.payment_method+"] Invoices: " + payment.invoice_ids.toString() + "</b> <br>" + payment.created_at, paymentsList_OnTouch.bind({}, payment), true);
      }

      paymentsList.manager.emit("setup");

    });

    paymentsList.manager.on("show", function(keepData) {
      paymentsList.manager.emit("clear");
      //paymentsList.manager.parent().emit("loading");

      api.get("/payments", {}, function(data) {

        //paymentsList.manager.parent().emit("doneLoading");

        paymentsList.manager.emit("update", data.payments);

      });
    });


    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Payments";
    }, function() {
      paymentsList.manager.show();
    },true);


    paymentsList.manager.parent(imports.mainLayout.mainPage.manager);
    paymentsView.manager.parent(imports.mainLayout.mainPage.manager);

    register(null, {
      payments: {}
    });
  }

});
