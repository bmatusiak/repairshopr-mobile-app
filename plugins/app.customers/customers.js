/* globals app */
define(function() {

    plugin.provides = ["customers"];

    plugin.consumes = ["factory", "settings","mainLayout","api"];

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
        var customerView = factory.createList("customerView");


        customerView.manager.on("update", function(customer) {
            customerView.manager.emit("clear");

            customerView.manager.emit("setup");
        });

        customerView.manager.on("show", function(keepData) {
            if (!keepData) {

            }
        });

        /****       ****/
        var customersList = factory.createList("customersList");
    
        customersList.on( "filterablebeforefilter", function ( e, data ) {
				var $ul = $( this ),
					$input = $( data.input ),
					value = $input.val(),
					html = "";
				$ul.html( "" );
				if ( value && value.length > 2 ) {
					$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
					$ul.listview( "refresh" );
					$.ajax({
						url: "http://gd.geobytes.com/AutoCompleteCity",
						dataType: "jsonp",
						crossDomain: true,
						data: {
							q: $input.val()
						}
					})
					.then( function ( response ) {
						$.each( response, function ( i, val ) {
							html += "<li>" + val + "</li>";
						});
						$ul.html( html );
						$ul.listview( "refresh" );
						$ul.trigger( "updatelayout");
					});
				}
			});

        customersList.manager.on("update", function(customer) {
            customersList.manager.emit("clear");
            customersList.manager.parent().emit("loading");
            api.customers(function(data){
                
                var customers = data.customers;
                
                
            },function(){
                
            },function(){ 
                customersList.manager.parent().emit("doneLoading");
            });
            
            customersList.manager.emit("setup");
        });

        customersList.manager.on("show", function(keepData) {
            if (!keepData) {
        
            }
        });

        
        imports.mainLayout.startList.manager.emit("addItem",function(){
            return "Customers";
        },function(){
            customersList.manager.show();
        });
        

        customersList.manager.parent(imports.mainLayout.mainPage.manager);
        customerView.manager.parent(imports.mainLayout.mainPage.manager);
        

        register(null, {
            customers: {
                customerView:customerView,
                customersList:customersList
            }
        });
    }

});