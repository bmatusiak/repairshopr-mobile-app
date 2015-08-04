/* globals app*/
define(["events"], function(events) {
    var EventEmitter = events.EventEmitter;

    plugin.provides = ["factory"];

    return plugin;

    function plugin(options, imports, register) {

        function parentAble(child){
            return function(Parent) {
                if(Parent && !child.manager.getParent){
                    if(child.manager && child.manager.id)
                        Parent.emit("addChild", child.manager.id, child);

                    child.manager.emit("addParent", Parent);
                    child.manager.getParent = function(){
                        return Parent;
                    }
                }
                return child.manager.getParent();
            };
        }
        var CreateList = function(id, listView) {

            var parent;
            var itemsList = [];
            var listEvents = new EventEmitter();

            listEvents.id = id;
            listView.manager = listEvents;
            listEvents.parent = parentAble(listView);

            listEvents.on("addParent",function(Parrent){
                parent = Parrent;
            });

            listEvents.on("setup", function() {
                listEvents.emit("clear",true);
                //listView.html("");
                for (var i = 0; i < itemsList.length; i++) {
                    itemsList[i]();
                }
                listView.listview('refresh');
            });

            listEvents.on("addItem", function(itemName, onClick, setup,perm,parsed) {
                var itemNameFn = function() {
                        if (typeof itemName == "function")
                            return itemName();
                        else return itemName;
                    };
                itemsList.push(function() {
                    var body = $("<p/>");
                    body.css("text-overflow" , "initial");
                    body.css("overflow" , "initial");
                    body.css("white-space" , "initial");

                    var data = itemNameFn();
                    if(typeof data == "object")
                        body.append(data);
                    else
                        body.html(data);
                    var li =$("<li/>",{
                        perm:(perm ? "true" : "false"),
                        "data-icon":(onClick ? undefined : false)
                    }).append($("<a/>").click(onClick).html(body));

                    if(parsed)
                        parsed(li);
                    listView.append(li);
                });
                if(setup)
                    listEvents.emit("setup");
            });

            listEvents.on("clear", function(dontClean) {
                listView.find('li:not([perm="true"])').remove();
                if(!dontClean)
                    itemsList = [];
            });


            listEvents.on("show", function() {
                listView.show();
            });


            listEvents.show = function() {
                var args = argsToArr(arguments);
                args.unshift(listView.manager.id);
                args.unshift("next");
                parent.emit.apply(parent, args);
            };

            listEvents.start = function() {
                var args = argsToArr(arguments);
                args.unshift(listView.manager.id);
                args.unshift("start");
                parent.emit.apply(parent, args);
            };

            listEvents.searchable = function(doSearch){
                var searchForm = $("<form/>");
                searchForm.submit(function(e) {
                  e.preventDefault();
                });
                var searchDiv = $("<div/>");
                searchDiv.addClass("ui-input-search ui-shadow-inset ui-input-has-clear ui-body-a ui-corner-all");
                var searchInput = $("<input/>");
                searchForm.append(searchDiv);
                searchDiv.append(searchInput);
                listEvents.emit("addItem", searchForm, false, true, true);
                var updating = false;
                var doAgain = false;
                var doAlways = function() {
                      updating = false;
                      if (doAgain) {
                        doAgain = false;
                        doUpdate();
                      }
                    };
                var doUpdate = function() {
                  if (!updating) {
                    updating = true;
                    doSearch(searchInput.val(),doAlways);
                  }
                  else doAgain = true;
                };

                searchInput.on("keyup", doUpdate);
            };

            return listEvents;
        };


        var ManageContainer = function(id, layout) {

            var layoutChildren = {};

            var layoutEvents = new EventEmitter();
            layoutEvents.id = id;
            layout.manager = layoutEvents;

            layoutEvents.parent = parentAble(layout);

            layoutEvents.on("addChild", function(id, child) {
                layout.append(child);
                layoutChildren[id] = child;
                child.hide();

                if (child.manager) {
                    child.manager.emit("add", layout);
                }
            });

            layoutEvents.on("hideChildren", function() {
                for (var i in layoutChildren) {
                    layoutEvents.emit("hideChild", i);
                }
            });

            layoutEvents.on("hideChild", function() {
                var args = argsToArr(arguments);
                var id = args.shift();
                args.unshift("hide");
                if (layoutChildren[id]) {
                    layoutChildren[id].hide();

                    if (layoutChildren[id].manager)
                        layoutChildren[id].manager.emit.apply(layoutChildren[id].manager, args);
                }
            });


            layoutEvents.on("showChild", function() {
                var args = argsToArr(arguments);
                var id = args.shift();
                args.unshift("show");
                var child = layoutChildren[id];
                if (child) {
                    child.show();
                    if (child.manager)
                        child.manager.emit.apply(layoutChildren[id].manager, args);
                }
            });

        };


        var ManagePage = function(id, layout) {

            var currentView = null;
            var viewOrder = [];

            var layoutEvents = layout.manager;

            layoutEvents.on("start", function(id) {
                layoutEvents.emit("reset");
                layoutEvents.emit("showChild", id);
                currentView = id;
            });

            layoutEvents.on("back", function(callback) {
                var id = viewOrder.pop();
                if (!id) {
                    if (callback) callback(true);
                }
                else {
                    //layoutEvents.emit("hideChildren");
                    //layoutEvents.emit("showChild", id,true);
                    currentView = false;
                    layoutEvents.emit("next", id, true);
                }
            });

            layoutEvents.on("next", function(id, keepdata) {
                if (currentView)
                    viewOrder.push(currentView);
                currentView = id;
                layoutEvents.emit("hideChildren");


                var args = argsToArr(arguments);
                args.unshift("showChild");
                layoutEvents.emit.apply(layoutEvents, args);
            });


            layoutEvents.on("reset", function() {
                currentView = null;
                viewOrder = [];
                layoutEvents.emit("hideChildren");
            });

        };

        function argsToArr(args) {
            var arr = [];
            for (var i = 0; i < args.length; i++) {
                arr.push(args[i]);
            }
            return arr;
        }

        register(null, {
            factory: {
                managePage: function(container) {
                    var $container = $(container);
                    ManageContainer(container, $container);
                    ManagePage(container, $container);
                    return $container;
                },
                createList: function(id,data) {
                    if(typeof data == "object"){
                        data.id = id;
                    }else data = {id:id};
                    var listView = $("<ul/>",data);

                    listView.listview({
                        defaults: true
                    });

                    listView.manager = CreateList(id, listView);

                    return listView;
                }
            }
        });
    }

});