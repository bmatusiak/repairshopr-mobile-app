/* globals app */
define(function() {

  plugin.provides = ["customers"];

  plugin.consumes = ["factory", "settings", "mainLayout", "api", "customer_assets", "hub", "tools"];

  return plugin;

  function plugin(options, imports, register) {
    var settings = imports.settings;
    var factory = imports.factory;
    var api = imports.api;
    var customer_assets = imports.customer_assets;
    var tools = imports.tools;

    var tickets;

    imports.hub.on("service", function(name, service) {
      if (name == "tickets") {
        tickets = service;
      }
    });



    var addEditCustomer = factory.createList("addEditCustomer");

    addEditCustomer.manager.on("update", function(customer) {
      var isNew = false;
      if (!customer) isNew = true;

      function createEditItem(name, data) {
        var container = $("<div/>");

        var title = $("<b/>");
        title.text(name + ":");
        container.append(title);

        var input = $("<input/>");
        input.css("width", "100%");
        container.append(input);

        if (data)
          input.val(data);

        input.textinput();

        addEditCustomer.manager.emit("addItem", container);
        return input;
      }
      addEditCustomer.manager.emit("clear");

      var customerFirstNameInput = createEditItem("Customer First Name", customer ? customer.firstname : "");
      var customerLastNameInput = createEditItem("Customer Last Name", customer ? customer.lastname : "");
      var customerPhoneInput = createEditItem("Phone", customer ? customer.phone : "");
      var customerEmailInput = createEditItem("Email", customer ? customer.email : "");

      addEditCustomer.manager.emit("addDivider");
      //mobile, business_name, address, address_2, city, state, zip

      var customerMobileInput = createEditItem("Mobile", customer ? customer.mobile : "");
      var customerBusinessInput = createEditItem("business_name", customer ? customer.business_name : "");
      var customerAddressInput = createEditItem("address", customer ? customer.address : "");
      var customerAddress2Input = createEditItem("address_2", customer ? customer.address_2 : "");
      var customerCityInput = createEditItem("city", customer ? customer.city : "");
      var customerStateInput = createEditItem("state", customer ? customer.state : "");
      var customerZipInput = createEditItem("zip", customer ? customer.zip : "");

      addEditCustomer.manager.emit("addItem", "Save", function() {
        if (!confirm("Are you sure?")) return;

        var requiredFulfilled = true;
        var savedCustomer = {
          //firstname, lastname, phone, email, mobile, business_name, address, address_2, city, state, zip
        };

        function checkInput(input, pointer,required) {
          if(input.val() !== "")
            if(customer[pointer] !== input.val())
              savedCustomer[pointer] = input.val();

          if(required && savedCustomer[pointer] == "") requiredFulfilled = false;
        }

        checkInput(customerFirstNameInput,"firstname",true);
        checkInput(customerLastNameInput,"lastname",true);
        checkInput(customerPhoneInput,"phone",true);
        checkInput(customerEmailInput,"email",true);
        checkInput(customerMobileInput,"mobile");
        checkInput(customerBusinessInput,"business_name");
        checkInput(customerAddressInput,"address");
        checkInput(customerAddress2Input,"address_2");
        checkInput(customerCityInput,"city");
        checkInput(customerStateInput,"state");
        checkInput(customerZipInput,"zip");

        if(!requiredFulfilled)
          return alert("Firstname, Lastname, Phone, Email: Are required Fileds!");

        if (isNew)
          api.post("/customers", savedCustomer,function(data){
          customerView.manager.emit("update",data.customer);
          customerView.manager.show();
        },false,function(){
            imports.mainLayout.mainPage.manager.emit("back");
          });
        else api.put("/customers/" + customer.id, savedCustomer,function(data){
          customerView.manager.emit("update",data.customer);
        },false,function(){
            imports.mainLayout.mainPage.manager.emit("back");
          });
      });

      addEditCustomer.manager.emit("setup");

    });
    addEditCustomer.manager.parent(imports.mainLayout.mainPage.manager);


    /****       ****/
    var addTicket = factory.createList("addTicket");

    addTicket.manager.on("update", function(customer) {
      addTicket.manager.emit("clear");


      var customerTitle = $("<b/>");
      customerTitle.text(customer.fullname);

      addTicket.manager.emit("addItem", customerTitle);

      var ticketTitleContainer = $("<div/>");

      var ticketTitle = $("<b/>");
      ticketTitle.text("Ticket Title (short description):");
      ticketTitleContainer.append(ticketTitle);

      var ticketTitleInput = $("<input/>");
      ticketTitleInput.css("width", "100%");
      ticketTitleContainer.append(ticketTitleInput);

      ticketTitleInput.textinput();

      addTicket.manager.emit("addItem", ticketTitleContainer);

      var ticketTypeContainer = $("<div/>");

      var ticketTypeTitle = $("<b/>");
      ticketTypeTitle.text("Ticket Type:");
      ticketTypeContainer.append(ticketTypeTitle);

      var ticketTypes = {
        "": "",
        "Virus": "Virus",
        "TuneUp": "TuneUp",
        "Hardware": "Hardware",
        "Software": "Software",
        "Other": "Other"
      };

      var ticketType = $('<select />'); //.find(":selected").text();
      ticketType.css("width", "100%");
      for (var val in ticketTypes) {
        $('<option />', {
          value: val,
          text: ticketTypes[val]
        }).appendTo(ticketType);
      }
      ticketTypeContainer.append(ticketType);
      ticketType.selectmenu();

      addTicket.manager.emit("addItem", ticketTypeContainer);

      var commentBodyContainer = $("<div/>");

      var commentBodyTitle = $("<b/>");
      commentBodyTitle.text("Complete Issue Description (this is emailed):");
      commentBodyContainer.append(commentBodyTitle);

      var commentBodyInput = $("<textarea/>");
      commentBodyInput.textinput();
      commentBodyInput.css("width", "100%");
      commentBodyInput.css("min-height", "100px");
      commentBodyContainer.append(commentBodyInput);

      addTicket.manager.emit("addItem", commentBodyContainer);

      addTicket.manager.emit("addItem", "Create Ticket", function() {
        if (!confirm("Create Ticket?")) return;
        var subject = ticketTitleInput.val();
        var problem_type = ticketType.find(":selected").text();
        var comment_body = commentBodyInput.val();

        var error = false;
        if (subject == "") {
          alert("Ticket Title is required!");
          error = true;
        }
        if (problem_type == "") {
          alert("Ticket Type is required!");
          error = true;
        }
        if (comment_body == "") {
          alert("Description is required!");
          error = true;
        }
        if (error) return;

        api.post("/tickets", {
          customer_id: customer.id,
          subject: subject,
          status: "New",
          problem_type: problem_type,
          comment_subject: "Initial Issue",
          comment_body: comment_body
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
      if (customer.email)
        customerView.manager.emit("addItem", "Email: <b>" + customer.email + "</b>");
      if (customer.phone)
        customerView.manager.emit("addItem", "Phone: <b><a href='tel:" + customer.phone + "'>" + customer.phone + "</a></b>");
      if (customer.mobile)
        customerView.manager.emit("addItem", "Mobile: <b><a href='tel:" + customer.mobile + "'>" + customer.mobile + "</a></b>");
      customerView.manager.emit("addItem", "Created: <b>" + tools.format.date(customer.created_at) + "</b>");
      if (customer.address || customer.city || customer.state || customer.zip)
        customerView.manager.emit("addItem", "Address: <b>" + customer.address + "<br/>" + customer.city + ", " + customer.state + " " + customer.zip + "</b>");
      if (customer.location_name)
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
        tickets.ticketsListLayout.manager.show(false, customer.id, true);
      });

      customerView.manager.emit("addItem", "Edit Customer", function() {
        addEditCustomer.manager.emit("update", customer);
        addEditCustomer.manager.show();
      });

      /*customerView.manager.emit("addItem", "Delete Customer", function() {
        if(!confirm("Are you sure you want to delete customer '"+customer.fullname+"'?")) return;
        if(!confirm("Again! Are you sure you want to delete customer '"+customer.fullname+"'?")) return;
        api.delete("/customer/"+customer.id,{},false,false,function(){
          imports.mainLayout.mainPage.manager.emit("back");
        });
      });*/

      customerView.manager.emit("setup");
    });

    customerView.manager.on("show", function(keepData) {
      if (!keepData) {
        //alert("load customerView dont keep data")
      }
    });

    /****       ****/

    var customersList = factory.createList("customersList");


    function updateBasicList() {
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
    var customersListUpdate = function(val, done) {
      if (val == "") {
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
    }

    var customerSearchable = customersList.manager.searchable(customersListUpdate);

    customersList.manager.on("show", function(keepData) {
      customerSearchable.call();
    });




    imports.mainLayout.startList.manager.emit("addItem", function() {
      return "Customers";
    }, function() {
      customersList.manager.show();
    }, true);


    var addCustomerBtn = $("<span/>", {
      class: "ui-btn-right",
      style: "padding: 16px 30px 0px 0px;"
    });
    addCustomerBtn.html("&nbsp;");
    addCustomerBtn.button();
    addCustomerBtn.buttonMarkup({
      icon: "plus"
    });
    $("#header").append(addCustomerBtn);

    customersList.manager.on("hide", function() {
      addCustomerBtn.hide();
    });
    customersList.manager.on("show", function() {
      addCustomerBtn.show();
    });

    addCustomerBtn.click(function() {
      addEditCustomer.manager.emit("update");
      addEditCustomer.manager.show();
    });


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
