


var phonegap = require('connect-phonegap');
phonegap.serve({port:process.env.PORT}).on("log",function(){console.log.apply({},arguments)});

