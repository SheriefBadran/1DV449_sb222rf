#!/bin/env node

var application_root = __dirname,
    request = require('request'),
    express = require('express'), //Web framework
    morgan = require('morgan'), // (since Express 4.0.0)
    bodyParser = require('body-parser'), // (since Express 4.0.0)
    errorHandler = require('errorhandler'), // (since Express 4.0.0)
    path = require('path'), // Utilities for dealing with file paths
    fs = require('fs'),
    app = express();

// Configure server (since Express 4.0.0)
var env = process.env.NODE_ENV || 'development';

if ('development' == env) {

    app.use('/', express.static(path.join(application_root, 'app')));
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(errorHandler({dumpExceptions: true, showStack: true}));
};

//Start server
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8000;

app.set('ipaddr', ipaddr);
app.set('port', port);

var server = app.listen(port, ipaddr, function () {
    console.log('Express server listening on port %d in %s mode',
        port, app.settings.env);
});


var sanitize = function (string) {

    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

var io = require('socket.io').listen(server);

var parse = JSON.parse("{}");

try {

    parse = JSON.parse(fs.readFileSync('traffic.json'))
}
catch (e) {

    console.log("Error!");
}

var getTrafficEvents = function () {

    request('http://api.sr.se/api/v2/traffic/messages?format=json&indent=true&size=1000', function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            if (JSON.stringify(parse) !== JSON.stringify(jsonData)) {

                console.log('new data');
                try {
                    parse = jsonData;
                    io.sockets.emit('load', jsonData);
                    fs.writeFile('traffic.json', body, function (err) {

                        if (err) {
                            throw err;
                        };
                    });
                }
                catch (e) {

                    fs.writeFile('traffic.json', "{}");
                }
            }
            else {

                console.log('no new data');
            }
        }
    });
};

getTrafficEvents();
setInterval(getTrafficEvents, 20000);

io.sockets.on('connection', function (client) {

    client.emit('load', parse);
});