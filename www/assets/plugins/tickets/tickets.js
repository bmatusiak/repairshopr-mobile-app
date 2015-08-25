/* globals app */
define(function() {

    plugin.provides = ["tickets"];

    plugin.consumes = ["factory", "settings","mainLayout","customers","api","tools"];

    return plugin;

    function plugin(options, imports, register) {
        var settings = imports.settings;
        var factory = imports.factory;
        var customers = imports.customers;
        var api = imports.api;
        var formatDate = imports.tools.format.date;

        /****       ****/
        var changeTicketStatus = factory.createList("changeTicketStatus",imports.mainLayout.mainPage);


        changeTicketStatus.on("update", function(ticket) {
            changeTicketStatus.clear();
            api.get("/tickets/settings",{},function(data){
                //var statuss = ["New","Waiting for Parts","Waiting on Customer","In Progress","Waiting For Pickup","Resolved"];
                var statuss = data.ticket_status_list;
                changeTicketStatus.addItem( "<b>" + ticket.number + " - [" + ticket.status + "] " + ticket.customer_business_then_name + "</b> <span style='float: right;font-weight: bold;'>"+ ticket.subject+"</span><br>" + ticket.problem_type + " - " + formatDate(ticket.updated_at));
                for (var i = 0; i < statuss.length; i++) {
                    changeTicketStatus.addItem( statuss[i],(function(status){
                        if(!window.confirm("Are your sure?")) return;
                        api.put("/tickets/"+ticket.id,{
                            status: status
                        },function(){
                            addComment.back();
                            ticketLayout.emit("update", ticket, true);
                        },function(){
                            console.log(arguments);
                        });
                    }).bind({},statuss[i]) );
                }

                changeTicketStatus.setup();

            })
        });

        /****       ****/
        var addComment = factory.createList("addComment",imports.mainLayout.mainPage);


        addComment.on("update", function(ticket) {
            addComment.clear();
            addComment.addItem( "<b>" + ticket.number + " - [" + ticket.status + "] " + ticket.customer_business_then_name + "</b> <span style='float: right;font-weight: bold;'>"+ ticket.subject+"</span><br>" + ticket.problem_type + " - " + formatDate(ticket.updated_at));

            var item =  $("<textarea/>");
            item.css("width","100%");
            item.css("min-height","100px");

            addComment.addItem(item);


            addComment.addItem( "Preview Comment", function() {
                var commentText = item.val();
                previewComment.emit("update",ticket, commentText);
                previewComment.next();
            });
            addComment.setup();
        });

        var previewComment = factory.createList("previewComment",imports.mainLayout.mainPage);
        previewComment.on("update", function(ticket, comment) {
            previewComment.clear();
            previewComment.addItem( "<b>" + ticket.number + " - [" + ticket.status + "] " + ticket.customer_business_then_name + "</b> <span style='float: right;font-weight: bold;'>"+ ticket.subject+"</span><br>" + ticket.problem_type + " - " + formatDate(ticket.updated_at));

            var text = $("<textarea/>",{disabled:"disabled"});
            text.css("width","100%");
            text.css("min-height","100px");
            text.text(comment);
            previewComment.addItem( text);
            previewComment.addItem( "Save Comment", function() {
                if(!window.confirm("Are your sure?")) return;
                api.post("/tickets/"+ticket.number+"/comment",{
                    subject:"Update",
                    body: text.text(),
                    hidden:"0",
                    sms_body:"",
                    do_not_email:"1"
                },function(){
                    addComment.back();
                    addComment.back();
                    ticketLayout.emit("update", ticket, true);
                },function(){
                    console.log(arguments)
                });
            });
            previewComment.addItem( "Save Comment & Email", function() {
                if(!window.confirm("Are your sure?")) return;
                api.post("/tickets/"+ticket.number+"/comment",{
                    subject:"Update",
                    body: text.text(),
                    hidden:"0",
                    sms_body:"",
                    do_not_email:"0"
                },function(){
                    addComment.back();
                    addComment.back();
                    ticketLayout.emit("update", ticket, true);
                },function(){
                    console.log(arguments)
                });
            });

            previewComment.addItem( "Save Hidden Comment", function() {
                if(!window.confirm("Are your sure?")) return;
                api.post("/tickets/"+ticket.number+"/comment",{
                    subject:"Update",
                    body: text.text(),
                    hidden:"1",
                    sms_body:"",
                    do_not_email:"1"
                },function(){
                    addComment.back();
                    addComment.back();
                    ticketLayout.emit("update", ticket, true);
                },function(){
                    console.log(arguments)
                });
            });
            previewComment.setup();
        });

        /****       ****/
        var ticketLayout = factory.createList("ticketView",imports.mainLayout.mainPage);

        ticketLayout.on("update", function(ticket,reloadTicket) {

            ticketLayout.clear();

            if(!reloadTicket) return parseTicket();
            else {

                //ticketsList.parent().emit("loading");
                var customer = ticket.customer;
                api.get("/tickets", {
                    number: ticket.number
                }, function(data) {
                    if(data.tickets && data.tickets[0]){
                        ticket = data.tickets[0];
                        ticket.customer = customer;
                    }
                    parseTicket();
                }, function(er) {
                   parseTicket();
                } ,function() {
                    //ticketsList.parent().emit("doneLoading");
                });
            }

            function parseTicket(){
                ticketLayout.addItem( ticket.number + " - " + ticket.customer.fullname + "",function(){
                    customers.customerView.emit("update", ticket.customer);
                    customers.customerView.next();
                });
                ticketLayout.addItem( "Status - " + ticket.status, function() {

                    changeTicketStatus.emit("update", ticket);
                    changeTicketStatus.next();
                });
                ticketLayout.addItem( "Created - " + formatDate(ticket.created_at));
                ticketLayout.addItem( "Updated - " + formatDate(ticket.updated_at));
                ticketLayout.addItem( "Location - " + ticket.location_id);
                ticketLayout.addItem( ticket.problem_type + " - " + ticket.subject + "");
                ticketLayout.addItem( "<b>Comments</b> <hr/>", function() {
                    addComment.emit("update", ticket);
                    addComment.next();
                });
                ticket.comments.reverse();
                for (var i in ticket.comments) {
                    ticketLayout.addItem( ticket.comments[i].tech + " - [<b>" + ticket.comments[i].subject + "</b>] - " + formatDate(ticket.created_at) + "<br/>" + ticket.comments[i].body.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                    //ticketLayout.addItem(ticket.comments[i].body);
                    //ticketLayout.addItem( "<hr/>");
                    ticketLayout.addDivider();


                }
                ticketLayout.setup();
            }
        });

        ticketLayout.on("show", function(ticket) {
            //alert(ticket.number);
        });


        /****  ****/

        var ticketsList = factory.createList("tickets",imports.mainLayout.mainPage);

        function loadCustomer(ticket,done,fail,always){
             api.get("/customers/" + ticket.customer_id, {
                }, function(data) {
                    ticket.customer = data.customer;
                    done(data);
                },fail, always);
        }

        function ticketsList_OnTouch(ticket) {
            //ticketsList.parent().emit("loading");
            //var item = ticketsList.itemData[ticketNumber];

            loadCustomer(ticket,function() {
                    ticketLayout.emit("update", ticket);
                    ticketLayout.next();
                },function(er) {
                    ticketLayout.emit("update", ticket);
                    ticketLayout.next();
                    alert("failed to get customer data");
                },function() {
                    //ticketsList.parent().emit("doneLoading");
                });
        }

        var sorter = (function() {
            var sort = {};


            return sort;
        })();


        var ticketSearch = ticketsList.searchable(function(val, done){
           if(val == ""){
               ticketsList.clear();
              getTicketsList(function(data){
                    ticketsList.emit("update", data.tickets);
                    done();
                });
              return;
            }
            ticketsList.clear();
            api.get("/tickets", {
              number: val
            }, function(data) {
              ticketsList.emit("update", data.tickets);
            }, function() {
                //api errors,,  youknow somthing thats not statusCode 200
            }, done);
        });

        ticketsList.on("update", function(tickets,hideSearch) {
            if(hideSearch)
                ticketSearch.hide();
            else
                ticketSearch.show();
            tickets.sort(function compare(a, b) {
                var timeB = new Date(a.updated_at).getTime();
                var timeA = new Date(b.updated_at).getTime();
                if (timeA < timeB)
                    return -1;
                if (timeA > timeB)
                    return 1;
                return 0;
            });
            ticketsList.itemData = {};
            var locationTickets = [];
            if (settings.get("location") && settings.get("location") >= 1) {
                for (var i in tickets) {
                    if (tickets[i].location_id == settings.get("location"))
                        locationTickets.push(tickets[i]);
                }
            }
            else locationTickets = tickets;

            for (var j in locationTickets) {
                var ticket = locationTickets[j];
                ticketsList.itemData[ticket.number] = ticket;
                var htmlBody = "";
                htmlBody += ticket.problem_type + " - " + formatDate(ticket.updated_at);
                //ticketsList.AddItem(ticket.number + " - [" + ticket.status + "] " + ticket.subject + "", htmlBody);
                ticketsList.addItem( "<b>" + ticket.number + " - [" + ticket.status + "] " +
                                                        ticket.customer_business_then_name + "</b> <span style='float: right;font-weight: bold;'>"+
                                                                ticket.subject+"</span><br>" + htmlBody,
                    ticketsList_OnTouch.bind({}, ticket),false,false,(function(ticket){
                        return function(li){
                            if(ticket.status == "Customer Reply"){
                                li.find("a").css("background-color","rgba(255, 0, 0, 0.27)");//red
                                li.find("a").css("text-shadow", "0 0");
                            }
                            if(ticket.status == "In Progress"){
                                li.find("a").css("background-color","rgba(0, 255, 0, 0.27)");//green
                                li.find("a").css("text-shadow", "0 0");
                            }
                            if(ticket.status == "New"){
                                li.find("a").css("background-color","rgba(0, 0, 255, 0.27)");//blue
                                li.find("a").css("text-shadow", "0 0");
                            }
                            if(ticket.status == "Invoiced"){
                                li.find("a").css("background-color","rgba(255, 255, 0, 0.27)");//yellow
                                li.find("a").css("text-shadow", "0 0");
                            }
                            if(ticket.status == "Waiting on Customer"){
                                li.find("a").css("background-color","rgba(0, 255, 255, 0.27)");//teal
                                li.find("a").css("text-shadow", "0 0");
                            }
                            if(ticket.status == "Waiting for Parts"){
                                li.find("a").css("background-color","rgba(255, 0, 255, 0.27)");//purple
                                li.find("a").css("text-shadow", "0 0");
                            }
                        }
                    })(ticket));
            }

            ticketsList.setup();
        });

        ticketsList.on("show", function(keepData,customer_id,hideSearch) {
            //if(!keepData){
                ticketsList.clear();
                //ticketsList.parent().emit("loading");

                getTicketsList(customer_id,function(data){

                    //ticketsList.parent().emit("doneLoading");

                    ticketsList.emit("update", data.tickets, hideSearch);

                });
            //}
        });

        function getTicketsList(customer_id,callback){
            var data = { status: "Not Closed" };
            var getall_onNone = true;
            if(!callback){
                callback = customer_id;
            }else if(customer_id){
                data = {customer_id:customer_id};
                getall_onNone = false;
            }
            api.get("/tickets", data ,function(data){
                if(!data.tickets.length && getall_onNone)
                    api.get("/tickets", {},function(data){
                        callback(data);
                    });
                else
                    callback(data);
            });
        }


        imports.mainLayout.startList.addItem(function(){
            return "Tickets";
        },function(){
            ticketsList.next();
        },true);


        register(null, {
            tickets: {
                ticketLayout: ticketLayout,
                ticketsListLayout: ticketsList,
                getTicketsList:getTicketsList,
                loadCustomer:loadCustomer,
                showTicket:ticketsList_OnTouch
            }
        });
    }

});