'use strict';
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

var server = app.listen(1337, function(){
  console.log('listening on port 1337');
});
