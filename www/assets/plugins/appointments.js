/* globals app */
define(function() {

  plugin.provides = ["appointments"];

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
    var appointmentsView = factory.createList("appointmentsView");


    appointmentsView.manager.on("update", function(appointment) {
      appointmentsView.manager.emit("clear");

      appointmentsView.manager.emit("addItem", "id: <b>" + appointment.id + "</b>");
      appointmentsView.manager.emit("addItem", "summary: <b>" + appointment.summary + "</b>");
      appointmentsView.manager.emit("addItem", "description: <b>" + appointment.description + "</b>");
      appointmentsView.manager.emit("addItem", "customer_id: <b>" + appointment.customer_id + "</b>");
      appointmentsView.manager.emit("addItem", "created_at: <b>" + appointment.created_at + "</b>");
      appointmentsView.manager.emit("addItem", "updated_at: <b>" + appointment.updated_at + "</b>");
      appointmentsView.manager.emit("addItem", "start_at: <b>" + appointment.start_at + "</b>");
      appointmentsView.manager.emit("addItem", "end_at: <b>" + appointment.end_at + "</b>");
      appointmentsView.manager.emit("addItem", "duration: <b>" + appointment.duration + "</b>");
      appointmentsView.manager.emit("addItem", "location: <b>" + appointment.location + "</b>");
      appointmentsView.manager.emit("addItem", "ticket_id: <b>" + appointment.ticket_id + "</b>");

      /*
       {
         id: 
         summary: 
         description: 
         customer_id: 
         created_at: 
         updated_at:
         start_at: 
         end_at: 
         duration: 
         location: 
         ticket_id:
       } 
      */
      appointmentsView.manager.emit("setup");
    });

    appointmentsView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    /****       ****/

    var appointmentsList = factory.createList("appointmentsList");

    function loadCustomer(appointment, done, fail, always) {
      api.get("/customers/" + appointment.customer_id, {}, function(data) {
        appointment.customer = data.customer;
        done(data);
      }, function(er) {
        fail(er);
      }, function() {
        always();
      });
    }

    function appointmentsList_OnTouch(appointment) {
      appointmentsList.manager.parent().emit("loading");
      //var item = ticketsList.itemData[ticketNumber];

      loadCustomer(appointment, function() {
        appointmentsView.manager.emit("update", appointment);
        appointmentsView.manager.show(appointment);
      }, function(er) {
        appointmentsView.manager.emit("update", appointment);
        appointmentsView.manager.show(appointment);
        alert("failed to get customer data");
      }, function() {
        appointmentsView.manager.parent().emit("doneLoading");
      });
    }

    appointmentsList.manager.on("update", function(appointments) {
      appointmentsList.manager.emit("clear");
      for (var j in appointments) {
        var appointment = appointments[j];
        
        appointmentsList.manager.emit("addItem", "<b>" + appointment.id + " - " + appointment.summary + "</b> <br>" + appointment.description, appointmentsList_OnTouch.bind({}, appointment), true);
      }

      appointmentsList.manager.emit("setup");

    });

    appointmentsList.manager.on("show", function(keepData) {
      appointmentsList.manager.emit("clear");
      appointmentsList.manager.parent().emit("loading");

      api.get("/appointments", {}, function(data) {

        appointmentsList.manager.parent().emit("doneLoading");

        appointmentsList.manager.emit("update", data.appointments);

      });
    });


    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Appointments";
    }, function() {
      appointmentsList.manager.show();
    });


    appointmentsList.manager.parent(imports.mainLayout.mainPage.manager);
    appointmentsView.manager.parent(imports.mainLayout.mainPage.manager);

    register(null, {
      appointments: {}
    });
  }

});
