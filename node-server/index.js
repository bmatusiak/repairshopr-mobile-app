var express = require('express');
var app = express();
var server = require('http').Server(app);
var expressDirectory = require('serve-index');

server.listen(process.env.PORT || 8080, process.env.IP || "127.0.0.1" ,function(){
    console.log('listening');
});


app.use('/', express.static(__dirname + '/../'));
app.use('/', expressDirectory(__dirname + '/../'));
