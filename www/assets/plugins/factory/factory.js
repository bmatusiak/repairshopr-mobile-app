"use strict";
/* globals app*/
define( function(events) {

    plugin.provides = ["factory"];
    plugin.consumes = ["events"];

    return plugin;

    function plugin(options, imports, register) {

        var EventEmitter = imports.events.EventEmitter;

        var PageManager = (function(){

            var PageManager = function (id, element) { //renamed arg for readability
                var self = this;
                this.defaultOptions = {};

                this.element = (id instanceof $) ? id : $(id);
                this.pages = {};

                var currentView = null;
                Object.defineProperty(self, "currentView", {
                  get: function() {return currentView }
                  //, set: function() { }
                });
                this.order = [];


                this.reset =  function() {
                    self.order = [];
                    self.hidePages();
                };

                this.start =  function(id) {
                    if(self.pages[id]){
                        self.reset();
                        currentView = false;
                        self.next(id);
                    }
                };

                this.next =  function(id) {
                    if(id && id != currentView){
                        if(currentView){
                            self.order.push(currentView);
                            self.pages[currentView].saveState(self.order.length);
                            self.pages[currentView].hide(function(){
                                currentView = id;
                                //self.pages[currentView].emit("update",self.order.length);
                                self.pages[currentView].show(null,"right");
                            },"left");
                        }else{
                            currentView = id;
                            //self.pages[currentView].emit("update",self.order.length);
                            self.pages[currentView].show(null,"right");
                        }
                        return self.order.length;
                    }
                };

                this.back =  function() {
                    var id = self.order.pop();//last page off bottom
                    if (!id) {
                        //if (callback) callback(true);//isend
                    }
                    else {
                        if(currentView){
                            self.pages[currentView].hide(function(){
                                currentView = id;
                                self.pages[currentView].loadState(self.order.length+1);
                                self.pages[currentView].show(null,"left");
                            },"right");
                        }else{
                            currentView = id;
                            self.pages[currentView].loadState(self.order.length+1);
                            self.pages[currentView].show(null,"left");
                        }
                    }
                };

                this.hidePages =  function() {
                    for(var i in self.pages)
                        self.hidePage(i);
                };

                this.hidePage =  function(id) {
                    self.pages[id].hide();
                };


                this.addPage =  function(child) {
                    var id = child.element.attr("id");
                    self.pages[id]= child;
                    self.element.append(child.element);
                };


            };
            $.extend(PageManager.prototype,EventEmitter.prototype);

            return PageManager;
        })();

      var CreateList = (function(){

            var CreateList = function (element,manager) { //renamed arg for readability
                var self = this;
                this.defaultOptions = {};

                this.element = (element instanceof $) ? element : $("<ul/>",element);
                this.element.listview({
                    defaults: true
                });
                this.element.hide();

                this.manager = manager;

                this.children = [];

                // this.effect = "blind";
                // this.effect = "bounce";
                // this.effect = "clip";
                // this.effect = "drop";
                // this.effect = "explode";
                // this.effect = "fade";
                // this.effect = "fold";
                // this.effect = "highlight";
                // this.effect = "puff";
                // this.effect = "pulsate";
                // this.effect = "shake";
                // this.effect = "size";
                this.effect = "slide";
                // this.effect = "transfer";

                this.effectOptions = {queue:false,duration:200};

                this.show = function(cb,direction) {
                    self.effectOptions.direction = direction;
                    if(!self.effect)
                        self.element.show(cb);
                    else
                        self.element.show(self.effect,self.effectOptions,cb);

                    self.emit("show");
                };

                this.hide = function(cb,direction) {
                    self.effectOptions.direction =direction;
                    if(!self.effect)
                        self.element.hide(cb);
                    else self.element.hide(self.effect,self.effectOptions,cb);

                    self.emit("hide");
                };

                var states = {};


                this.saveState = function(id) {
                    states[id] = self.children;
                };
                this.loadState = function(id) {
                    self.children = states[id];
                    self.setup();
                };

                this.next = function() {//shortcut to load itself
                    self.manager.next(self.element.attr("id"));
                };
                this.back = function(state) {//shortcut to load itself
                    self.manager.back();
                };

                this.start = function() {
                    self.manager.start(self.element.attr("id"));
                };

                this.setup = function() {
                    self.clear(true);
                    //listView.html("");
                    for (var i = 0; i < self.children.length; i++) {
                        self.children[i]();
                    }
                    self.element.listview('refresh');
                };

                var listInited = false;

                this.addItem = function(itemName, onClick, setup,perm,parsed) {
                    if(!listInited){
                        listInited = true;
                        self.children = [];
                    }
                    var itemNameFn = function() {
                            if (typeof itemName == "function")
                                return itemName();
                            else return itemName;
                        };
                    self.children.push(function() {
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
                        }).append($("<a/>").click(onClick).click(function(){self.emit("itemClick",li)}).html(body));

                        if(parsed)
                            parsed(li);
                        self.element.append(li);
                    });
                    if(setup)
                        self.setup();
                };


                this.addDivider = function() {

                    self.children.push(function() {
                        var li =$("<li/>",{
                            "data-role":"list-divider"
                        });

                        self.element.append(li);
                    });
                };

                this.clear = function(dontClean) {
                    self.element.find('li:not([perm="true"])').remove();
                    if(!dontClean)
                        self.children = [];
                };


                this.searchable = function(doSearch){
                    var searchForm = $("<form/>");
                    searchForm.submit(function(e) {
                      e.preventDefault();
                    });
                    var searchDiv = $("<div/>");
                    //searchDiv.addClass("ui-input-search ui-shadow-inset ui-input-has-clear ui-body-a ui-corner-all");
                    var searchInput = $("<input/>",{type:"search"});
                    searchForm.append(searchDiv);
                    searchDiv.append(searchInput);

                    searchInput.textinput({
                        //clearBtn: true,
                        //clearBtnText: ""
                    });


                    var renderedLI;
                    self.addItem(searchForm, false, true, true,function(LI){
                        renderedLI = LI;
                    });
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
                    searchDiv.contents().find(".ui-input-clear").click(doUpdate);

                    return {
                        hide:function(){
                            if(renderedLI) renderedLI.hide();
                        },
                        show:function(){
                            if(renderedLI) renderedLI.show();
                        },
                        call:function(){
                            doUpdate();
                        }
                    };
                };


                this.addItem(this.element.attr("id") +" No Items");
                listInited = false;
                this.setup();
                if(self.manager)
                    self.manager.addPage(self);
            };
            $.extend(CreateList.prototype,EventEmitter.prototype);

            return CreateList;
        })();


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
                    return new PageManager(container);
                },
                createList: function(data,manager) {
                    if(typeof data == "string")
                        data = {id:data};
                    return new CreateList(data, manager);
                }
            }
        });
    }

});