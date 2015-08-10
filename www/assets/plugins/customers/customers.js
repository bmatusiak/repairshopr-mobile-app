/* globals app */
define(function() {

  plugin.provides = ["customers"];

  plugin.consumes = ["factory", "settings", "mainLayout", "api", "customer_assets","hub","tools"];

  return plugin;

  function plugin(options, imports, register) {
    var settings = imports.settings;
    var factory = imports.factory;
    var api = imports.api;
    var customer_assets = imports.customer_assets;
    var tools = imports.tools;

    var tickets;

    imports.hub.on("service", function(name, service){
      if(name == "tickets"){
          tickets = service;
      }
    });

    var addTicket = factory.createList("addTicket");

    addTicket.manager.on("update", function(customer) {
      addTicket.manager.emit("clear");


      var customerTitle = $("<b/>");
      customerTitle.text(customer.fullname);

      addTicket.manager.emit("addItem", customerTitle );

       var ticketTitleContainer = $("<div/>");

      var ticketTitle = $("<b/>");
      ticketTitle.text("Ticket Title (short description):");
      ticketTitleContainer.append(ticketTitle);

      var ticketTitleInput = $("<input/>");
      ticketTitleInput.textinput();
      ticketTitleInput.css("width", "100%");
      ticketTitleContainer.append(ticketTitleInput);

      addTicket.manager.emit("addItem", ticketTitleContainer );

      var ticketTypeContainer = $("<div/>");

      var ticketTypeTitle = $("<b/>");
      ticketTypeTitle.text("Ticket Type:");
      ticketTypeContainer.append(ticketTypeTitle);

      var ticketTypes = {
            "":"",
            "Virus" : "Virus",
            "TuneUp" : "TuneUp",
            "Hardware" : "Hardware",
            "Software" : "Software",
            "Other" : "Other"
      };

      var ticketType = $('<select />');//.find(":selected").text();
      ticketType.css("width", "100%");
      for(var val in ticketTypes) {
          $('<option />', {value: val, text: ticketTypes[val]}).appendTo(ticketType);
      }
      ticketTypeContainer.append(ticketType);
      ticketType.selectmenu();

      addTicket.manager.emit("addItem", ticketTypeContainer );

      var commentBodyContainer = $("<div/>");

      var commentBodyTitle = $("<b/>");
      commentBodyTitle.text("Complete Issue Description (this is emailed):");
      commentBodyContainer.append(commentBodyTitle);

      var commentBodyInput = $("<textarea/>");
      commentBodyInput.textinput();
      commentBodyInput.css("width", "100%");
      commentBodyInput.css("min-height", "100px");
      commentBodyContainer.append(commentBodyInput);

      addTicket.manager.emit("addItem", commentBodyContainer );

      addTicket.manager.emit("addItem", "Create Ticket", function() {
        if(!confirm("Create Ticket?")) return alert("no");
        var subject = ticketTitleInput.val();
        var problem_type = ticketType.find(":selected").text();
        var comment_body = commentBodyInput.val();

        var error = false;
        if(subject == ""){
          alert("Ticket Title is required!");
          error = true;
        }
        if(problem_type == ""){
          alert("Ticket Type is required!");
          error = true;
        }
        if(comment_body == ""){
          alert("Description is required!");
          error = true;
        }
        if(error) return;

        api.post("/tickets", {
          customer_id: customer.id,
          subject: subject,
          status: "New",
          problem_type: problem_type,
          comment_subject : "Initial Issue",
          comment_body : comment_body
        }, function(data) {
          imports.mainLayout.mainPage.manager.emit("back");
          tickets.showTicket(data.ticket);
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
      customerView.manager.emit("addItem", "Phone: <b><a href='tel:"+customer.phone +"'>" + customer.phone + "</a></b>");
      customerView.manager.emit("addItem", "Mobile: <b><a href='tel:"+customer.mobile +"'>" + customer.mobile + "</a></b>");
      customerView.manager.emit("addItem", "Created: <b>" + tools.format.date(customer.created_at) + "</b>");
      customerView.manager.emit("addItem", "Address: <b>" + customer.address + "<br/>" + customer.city + ", " + customer.state + " " + customer.zip + "</b>");
      if(customer.location_name)
        customerView.manager.emit("addItem", "Location Name: <b>" + customer.location_name + "</b>");
      customerView.manager.emit("addItem", "Assets", function() {

        customer_assets.customer_assetsList.manager.emit("update", customer);
        customer_assets.customer_assetsList.manager.show();
      });

      customerView.manager.emit("addItem", "Create Ticket", function() {
        addTicket.manager.emit("update", customer);
        addTicket.manager.show();
      });


      customerView.manager.emit("addItem", "Tickets", function() {
        tickets.ticketsListLayout.manager.show(false,customer.id,true)
      });

      customerView.manager.emit("setup");
    });

    customerView.manager.on("show", function(keepData) {
      if (!keepData) {

      }
    });

    /****       ****/

    var customersList = factory.createList("customersList");

    customersList.manager.searchable(function(val, done){
       if(val == ""){
          updateBasicList();
          done();
          return;
        }
        customersList.manager.emit("clear");
        api.get("/customers/autocomplete", {
          query: val
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
            //api errors,,  youknow somthing thats not statusCode 200
        }, done);
    });



    function updateBasicList(){
      api.get("/customers", {}, function(data) {
          customersList.manager.emit("clear");
          for (var i in data.customers) {
            (function(customer) {
              customersList.manager.emit("addItem", "<b>" + data.customers[i].fullname + "</b>", function() {
                customerView.manager.emit("update", customer);
                customerView.manager.show();
              });
            })(data.customers[i]);
          }
          customersList.manager.emit("setup");
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
