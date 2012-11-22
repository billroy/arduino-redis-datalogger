//
// index.js: show a chart of data from the redis server
//
//	Copyright 2012 Bill Roy (MIT License; see LICENSE file)
//

var opt = require('optimist');
var argv = opt.usage('Usage: $0 [flags]')
	.alias('r', 'redis')
	.describe('r', 'url of the redis server, in redis-url format')
	.alias('p', 'port')
	.describe('p', 'port for the web server')
	.argv;

if (argv.help) {
	opt.showHelp();
	process.exit();
}

var redis;
if (argv.redis) {
	console.log("Connecting to Redis at " + argv.redis);
	redis = require('redis-url').connect(argv.redis);
}
else {
	console.log("Connecting to local Redis");
	redis = require("redis").createClient();		// port, host, options
}
redis.on("error", function (err) { console.error("Redis Error: " + err); });

var util = require('util');
var express = require('express');
var app = express();

app.configure(function () {
	app.use(express.logger());
});

app.get('/', function(req, res) { res.sendfile('index.html'); });

app.get('/json/:id', function(req, res) {
	redis.sort(req.params.id, "ALPHA", function (err, data) {
		if (err) {
			console.log('Redis error:', err);
			return;
		}
		//console.log('Data:', data);
		var payload = [];
		for (var i=0; i<data.length; i++) {
			payload.push(JSON.parse(data[i]));
		}
		var packet = JSON.stringify(payload);
		res.send(packet);
	});
});

function randInt(x) { return Math.floor(Math.random() * x); }

app.get('/random', function(req, res) {
	var millis = randInt(10000);
	var a0 = randInt(1024);
	var a1 = randInt(1024);
	var payload = [];
	for (var i=0; i<1000; i++) {
		payload.push({time:millis, a0:a0, a1:a1});
		millis = millis + 50;
		a0 = a0 + randInt(20) - 9;
		a1 = a1 + randInt(30) - 15;
	}
	var packet = JSON.stringify(payload);
	res.send(packet);
});

app.listen(argv.port || 3000);
