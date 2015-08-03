/* globals app */
define(function() {

  plugin.provides = ["leads"];

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
    var leadsView = factory.createList("leadsView");


    leadsView.manager.on("update", function(lead) {
      leadsView.manager.emit("clear");

      leadsView.manager.emit("addItem", "id: <b>" + lead.id + "</b>");
      leadsView.manager.emit("addItem", "first_name: <b>" + lead.first_name + "</b>");
      leadsView.manager.emit("addItem", "last_name: <b>" + lead.last_name + "</b>");
      leadsView.manager.emit("addItem", "email: <b>" + lead.email + "</b>");
      leadsView.manager.emit("addItem", "phone: <b>" + lead.phone + "</b>");
      leadsView.manager.emit("addItem", "mobile: <b>" + lead.mobile + "</b>");
      leadsView.manager.emit("addItem", "created_at: <b>" + lead.created_at + "</b>");
      leadsView.manager.emit("addItem", "updated_at: <b>" + lead.updated_at + "</b>");
      leadsView.manager.emit("addItem", "address: <b>" + lead.address + "</b>");
      leadsView.manager.emit("addItem", "city: <b>" + lead.city + "</b>");
      leadsView.manager.emit("addItem", "state: <b>" + lead.state + "</b>");
      leadsView.manager.emit("addItem", "zip: <b>" + lead.zip + "</b>");
      leadsView.manager.emit("addItem", "ticket_subject: <b>" + lead.ticket_subject + "</b>");
      leadsView.manager.emit("addItem", "ticket_description: <b>" + lead.ticket_description + "</b>");
      leadsView.manager.emit("addItem", "ticket_problem_type: <b>" + lead.ticket_problem_type + "</b>");
      leadsView.manager.emit("addItem", "ticket_id: <b>" + lead.ticket_id + "</b>");
      leadsView.manager.emit("addItem", "customer_id: <b>" + lead.customer_id + "</b>");
      leadsView.manager.emit("addItem", "contact_id: <b>" + lead.contact_id + "</b>");

      /*
       {
          id:
          first_name:
          last_name:
          email:
          phone:
          mobile:
          created_at:
          updated_at:
          address:
          city:
          state:
          zip:
          ticket_subject:
          ticket_description:
          ticket_problem_type:
          ticket_id:
          customer_id:
          contact_id:
       }
      */
      leadsView.manager.emit("setup");
    });

    leadsView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    /****       ****/

    var leadsList = factory.createList("leadsList");

    function leadsList_OnTouch(lead) {

        leadsView.manager.emit("update", lead);
        leadsView.manager.show(lead);
    }

    leadsList.manager.on("update", function(leads) {
      leadsList.manager.emit("clear");
      for (var j in leads) {
        var lead = leads[j];

        leadsList.manager.emit("addItem", "<b>" + lead.id + " - ["+lead.city+"] "+ lead.first_name + " " + lead.last_name +" - " + lead.phone + "</b> <br>" + lead.ticket_problem_type, leadsList_OnTouch.bind({}, lead), true);
      }

      leadsList.manager.emit("setup");

    });

    leadsList.manager.on("show", function(keepData) {
      leadsList.manager.emit("clear");
      leadsList.manager.parent().emit("loading");

      api.get("/leads", {}, function(data) {

        leadsList.manager.parent().emit("doneLoading");

        leadsList.manager.emit("update", data.leads);

      });
    });


    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Leads";
    }, function() {
      leadsList.manager.show();
    },true);


    leadsList.manager.parent(imports.mainLayout.mainPage.manager);
    leadsView.manager.parent(imports.mainLayout.mainPage.manager);

    register(null, {
      leads: {}
    });
  }

});
