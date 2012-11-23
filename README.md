# Bitlash Arduino Redis Datalogger

This example is a companion to the BitlashRedisClient redis client example that ships with Bitlash.  It collects data that Bitlash on the Arduino has pushed to a Redis server via ethernet, and displays it in a web page as a graph using the D3 visualization library, something like this:

![](https://raw.github.com/billroy/arduino-redis-datalogger/master/sample-chart.png)

You can find out more about Bitlash at http://bitlash.net, and more about the Bitlash redis client here: https://github.com/billroy/bitlash/blob/master/examples/BitlashRedisClient/BitlashRedisClient.pde

## Pre-install Requirements

### Redis

You need a Redis server (http://redis.io).  Set one up on your computer (it's an easy and small compile) or get a free tiny redis server at https://redistogo.com.  

Note that Redis is an in-memory database, so it will lose your data when you turn it off or your system crashes.  For this reason, it is worth learning how to dump your redis database to a file for safekeeping.  See, for example, http://stackoverflow.com/questions/6004915/how-do-i-move-a-redis-database-from-one-server-to-another

To run a local redis, start it in a terminal so you can watch it, like this:

	$ redis-server

Do the rest of the terminal work below in a new terminal window.

(In production you would run Redis in the background and set it to log to a file.)

If you are using a remote redis, you need its "redis url" when you start the server below.  Your service will provide this when you start the server.  They look something like: redis://username:password@my.host:6789


### Node.js and git

You need to install node.js (http://nodejs.org) and git (http://git-scm.com).


### Get the arduino-redis-datalogger code

Open a terminal window and enter the commands below to install the web chart server:

	$ git clone https://github.com/billroy/arduino-redis-datalogger
	$ cd arduino-redis-datalogger
	$ npm install
	$ node index.js 

NOTE: If you are using a non-local redis server, like redistogo, use this line to start the server instead:

	$ node index.js -r REDISTOGO_URL

Now open a web browser on http://localhost:3000 and you should see the chart page.

If you would prefer to start the web server on a different port:

	$ node index.js -p 8080

To stop the server, type Control-C in its terminal window.

### On the Arduino: Install

You need to install the Bitlash library (http://bitlash.net).  Don't forget to restart the Arduino software.

Once the Bitlash software is installed, you can install the bitlash redis client via:

	File -> Examples -> bitlash -> BitlashRedisClient

Before you upload the client you must customize the code for your IP address, gateway, and   network mask.  You must also enter the IP address of the redis server, which you can get by pinging the host in the redis url.  See the file BitlashRedisClient.pde at about line 166.

When you have finished your customizations:

	File -> Upload

Connect to your arduino with whatever serial monitor you usually use and you should be talking to Bitlash.

### On the Arduino: Testing the Arduino setup

This would be a good time to play around with the examples in the example .pde file to familiarize yourself with the operation of the Bitlash redis client.

Define these functions in Bitlash; you can copy and paste from here (minus the '>'):

	> function log {lpush("datalog", "{\"time\":%d,\"a0\":%d,\"a1\":%d}", millis, a0, a1);}

Push some data to the server to test:

	> log; log; log

Go refresh the chart and you should see three data points.

To log data every three seconds when the arduino boots:

	> function startup {run log,3000}
	> boot

Let it run a while and refresh the chart.

Congratulations, you have a working data collection and charting system.

### Charting different data

The charting program detects whatever fields you have present in the log records, so you could log a different set of values like this to see a different chart:

	> function log {lpush("datalog", "{\"time\":%d,\"a0\":%d,\"count\:%d,\"switch\":%d}", millis, a0, c, d3);}

