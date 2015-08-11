/* globals app */
define(function() {

  plugin.provides = ["invoices"];

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
    var invoicesView = factory.createList("invoicesView");


    invoicesView.manager.on("update", function(invoice) {
      invoicesView.manager.emit("clear");

      invoicesView.manager.emit("addItem", "id: <b>" + invoice.id + "</b>");
      invoicesView.manager.emit("addItem", "customer_id: <b>" + invoice.customer_id + "</b>");
      invoicesView.manager.emit("addItem", "customer_business_then_name: <b>" + invoice.customer_business_then_name + "</b>");
      invoicesView.manager.emit("addItem", "number: <b>" + invoice.number + "</b>");
      invoicesView.manager.emit("addItem", "created_at: <b>" + invoice.created_at + "</b>");
      invoicesView.manager.emit("addItem", "updated_at: <b>" + invoice.updated_at + "</b>");
      invoicesView.manager.emit("addItem", "date: <b>" + invoice.date + "</b>");
      invoicesView.manager.emit("addItem", "ticket_id: <b>" + invoice.ticket_id + "</b>");
      invoicesView.manager.emit("addItem", "is_paid: <b>" + invoice.is_paid + "</b>");
      invoicesView.manager.emit("addItem", "total: <b>" + invoice.total + "</b>");
      invoicesView.manager.emit("addItem", "verified_paid: <b>" + invoice.verified_paid + "</b>");

      /*
       {
          id:
          customer_id:
          customer_business_then_name:
          number:
          created_at:
          updated_at:
          date:
          subtotal:
          total:
          tax:
          verified_paid:
          tech_marked_paid:
          ticket_id:
          pdf_url:
          is_paid:
       }
      */
      invoicesView.manager.emit("setup");
    });

    invoicesView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    /****       ****/

    var invoicesList = factory.createList("invoicesList");

    function loadCustomer(invoice, done, fail, always) {
      api.get("/customers/" + invoice.customer_id, {}, function(data) {
        invoice.customer = data.customer;
        done(data);
      }, function(er) {
        fail(er);
      }, function() {
        always();
      });
    }

    function invoicesList_OnTouch(invoice) {
      //invoicesList.manager.parent().emit("loading");
      //var item = ticketsList.itemData[ticketNumber];

      loadCustomer(invoice, function() {
        invoicesView.manager.emit("update", invoice);
        invoicesView.manager.show(invoice);
      }, function(er) {
        invoicesView.manager.emit("update", invoice);
        invoicesView.manager.show(invoice);
        alert("failed to get customer data");
      }, function() {
        //invoicesView.manager.parent().emit("doneLoading");
      });
    }

    invoicesList.manager.on("update", function(invoices) {
      invoicesList.manager.emit("clear");
      for (var j in invoices) {
        var invoice = invoices[j];

        invoicesList.manager.emit("addItem", "<b>" + invoice.number + " - ["+(invoice.is_paid ? "PAID" : "UN-PAID")+"] " + invoice.customer_business_then_name + "</b> <br>" + invoice.date, invoicesList_OnTouch.bind({}, invoice), true);
      }

      invoicesList.manager.emit("setup");

    });

    invoicesList.manager.on("show", function(keepData) {
      invoicesList.manager.emit("clear");
      //invoicesList.manager.parent().emit("loading");

      api.get("/invoices", {}, function(data) {

        invoicesList.manager.parent().emit("doneLoading");

        //invoicesList.manager.emit("update", data.invoices);

      });
    });


    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Invoices";
    }, function() {
      invoicesList.manager.show();
    },true);


    invoicesList.manager.parent(imports.mainLayout.mainPage.manager);
    invoicesView.manager.parent(imports.mainLayout.mainPage.manager);

    register(null, {
      invoices: {}
    });
  }

});
