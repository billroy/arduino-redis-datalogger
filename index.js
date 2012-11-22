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
	//app.use(express.bodyParser());
	//app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) { res.sendfile('index.html'); });

app.get('/json/:id', function(req, res) {
	console.log('get:', req.params, req.body);
	redis.lrange(req.params.id, 0, 9999999, function (err, data) {
		console.log(err);
		console.log(data);
		var payload = [];
		//payload.push(['time','a0','a1']);
		for (var i=0; i<data.length; i++) {
			var row = JSON.parse(data[i]);
			//payload.push([row[0], row[1], row[2]]);
			payload.push({time: row[0], a0: row[1], a1: row[2]});
		}
		//var packet = util.inspect(payload);
		var packet = JSON.stringify(payload);
//		packet = packet.replace(/'/g, '"');
console.log('Packet:', packet);
		res.send(packet);
	});
});

app.listen(argv.port || 3000);
