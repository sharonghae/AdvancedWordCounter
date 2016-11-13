'use strict';
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

var port = process.env.PORT || 1337;

var server = app.listen(port, function(){
  console.log('listening on port ' + port);
});
