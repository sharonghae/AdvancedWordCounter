'use strict';
var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(path.join(__dirname, '/public')));

var server = app.listen(1337, function(){
  console.log('listening on port 1337');
});
