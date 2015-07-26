/* globals app */
define(function() {

    plugin.provides = ["tickets"];

    plugin.consumes = ["factory", "settings","mainLayout"];

    return plugin;

    function plugin(options, imports, register) {
        var settings = imports.settings;
        var factory = imports.factory;

        function formatDate(Adate) {
            var date = new Date(Adate);
            return date.toDateString() + ", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }

        /****       ****/
        var changeTicketStatus = factory.createList("changeTicketStatus");


        changeTicketStatus.manager.on("update", function(ticket) {
            changeTicketStatus.manager.emit("clear");

            //changeTicketStatus.manager.emit("addItem","Resolved");
            changeTicketStatus.manager.emit("addItem", "Waiting On Part");
            changeTicketStatus.manager.emit("addItem", "In Progress");
            changeTicketStatus.manager.emit("addItem", "Ready for Pickup");

        });

        changeTicketStatus.manager.on("show", function(keepData) {
            if (!keepData) {

            }
        });

        /****       ****/
        var addComment = factory.createList("addComment");


        addComment.manager.on("update", function(ticket) {
            addComment.manager.emit("clear");
            
            var item =  $("<textarea/>");
            item.css("width","100%");
            item.css("min-height","100px");
            
            addComment.manager.emit("addItem",item);
            

            addComment.manager.emit("addItem", "Preview Comment", function() {
                var commentText = item.val();
                previewComment.manager.emit("update",ticket, commentText);
                previewComment.manager.show(ticket,commentText);
            });
        });
        
        var previewComment = factory.createList("previewComment");
        previewComment.manager.on("update", function(ticket, comment) {
            previewComment.manager.emit("clear");
            var text = $("<p/>");
            text.text(comment);
            previewComment.manager.emit("addItem", text);
            previewComment.manager.emit("addItem", "Save Comment", function() {
                addComment.manager.parent().emit("back");
                addComment.manager.parent().emit("back");
                ticketLayout.manager.emit("update", ticket,true);
            });
            
            previewComment.manager.emit("addItem", "Save Hidden Comment", function() {
                addComment.manager.parent().emit("back");
                addComment.manager.parent().emit("back");
                ticketLayout.manager.emit("update", ticket,true);
            });
        });

        /****       ****/
        var ticketLayout = factory.createList("ticketView");

        ticketLayout.manager.on("addParent", function(Parent) {
            changeTicketStatus.manager.parent(Parent);
            addComment.manager.parent(Parent);
            previewComment.manager.parent(Parent);
        });

        ticketLayout.manager.on("update", function(ticket,reloadTicket) {
            
            ticketLayout.manager.emit("clear");
            
            if(!reloadTicket) return parseTicket();
            else {
                
                ticketsList.manager.parent().emit("loading");
                var customer = ticket.customer;
                $.get("https://"+settings.get("domain")+".repairshopr.com/api/v1/tickets", {
                    api_key: settings.get("api_key"),
                    number: ticket.number
                }).done(function(data) {
                    if(data.tickets && data.tickets[0]){
                        ticket = data.tickets[0];
                        ticket.customer = customer;
                    }
                    parseTicket();
                }).fail(function(er) {
                   parseTicket();
                })
                .always(function() {
                    ticketsList.manager.parent().emit("doneLoading");
                });
            }
            
            function parseTicket(){
                ticketLayout.manager.emit("addItem", ticket.number + " - " + ticket.customer.fullname + "");
                ticketLayout.manager.emit("addItem", "Status - " + ticket.status, function() {
    
                    changeTicketStatus.manager.emit("update", ticket);
                    changeTicketStatus.manager.show(ticket);
                });
                ticketLayout.manager.emit("addItem", "Created - " + formatDate(ticket.created_at));
                ticketLayout.manager.emit("addItem", "Updated - " + formatDate(ticket.updated_at));
                ticketLayout.manager.emit("addItem", "Location - " + ticket.location_id);
                ticketLayout.manager.emit("addItem", ticket.problem_type + " - " + ticket.subject + "");
                ticketLayout.manager.emit("addItem", "<b>Comments</b> <hr/>", function() {
                    addComment.manager.emit("update", ticket);
                    addComment.manager.show(ticket);
                });
                ticket.comments.reverse();
                for (var i in ticket.comments) {
                    ticketLayout.manager.emit("addItem", ticket.comments[i].tech + " - [<b>" + ticket.comments[i].subject + "</b>] - " + formatDate(ticket.created_at) + "<br/>" + ticket.comments[i].body);
                    //ticketLayout.manager.emit("addItem",ticket.comments[i].body);
                    ticketLayout.manager.emit("addItem", "<hr/>");
    
                }
            }
        });

        ticketLayout.manager.on("show", function(ticket) {
            //alert(ticket.number);
        });


        /****  ****/

        var ticketsList = factory.createList("tickets");

        ticketsList.manager.on("addParent", function(Parent) {
            ticketLayout.manager.parent(Parent);
        });
        
        function loadCustomer(ticket,done,fail,always){
             $.get("https://"+settings.get("domain")+".repairshopr.com/api/v1/customers/" + ticket.customer_id, {
                    api_key: settings.get("api_key")
                }).done(function(data) {
                    ticket.customer = data.customer;
                    done(data);
                }).fail(function(er) {
                    fail(er);
                })
                .always(function() {
                    always();
                });
        }

        function ticketsList_OnTouch(ticket) {
            ticketsList.manager.parent().emit("loading");
            //var item = ticketsList.itemData[ticketNumber];
            
            loadCustomer(ticket,function() {
                    ticketLayout.manager.emit("update", ticket);
                    ticketLayout.manager.show(ticket);
                },function(er) {
                    ticketLayout.manager.emit("update", ticket);
                    ticketLayout.manager.show(ticket);
                    alert("failed to get customer data");
                },function() {
                    ticketsList.manager.parent().emit("doneLoading");
                });
        }

        var sorter = (function() {
            var sort = {};


            return sort;
        })();


        ticketsList.manager.on("update", function(tickets) {
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

            console.log(locationTickets);

            for (var j in locationTickets) {
                var ticket = locationTickets[j];
                ticketsList.itemData[ticket.number] = ticket;
                var htmlBody = "";
                htmlBody += ticket.problem_type + " - " + formatDate(ticket.updated_at);
                //ticketsList.AddItem(ticket.number + " - [" + ticket.status + "] " + ticket.subject + "", htmlBody);
                ticketsList.manager.emit("addItem", "<b>" + ticket.number + " - [" + ticket.status + "] " + ticket.subject + "</b><br>" + htmlBody, ticketsList_OnTouch.bind({}, ticket),true);
            }
            
            ticketsList.manager.emit("setup");
        });

        ticketsList.manager.on("show", function(keepData) {
            //if (!keepData) {
                ticketsList.manager.emit("clear");
                ticketsList.manager.parent().emit("loading");

                $.get("https://"+settings.get("domain")+".repairshopr.com/api/v1/tickets.json", {
                    api_key: settings.get("api_key"),
                    status: "Not Closed"
                }).done(function(data) {

                    ticketsList.manager.parent().emit("doneLoading");

                    ticketsList.manager.emit("update", data.tickets);

                }).fail(function(er) {

                });
            //}
        });
        
        
        imports.mainLayout.startList.manager.emit("addItem",function(){
            return "Tickets";
        },function(){
            ticketsList.manager.show();
        });
        

        register(null, {
            tickets: {
                ticketLayout: ticketLayout,
                ticketsListLayout: ticketsList
            }
        });
    }

});