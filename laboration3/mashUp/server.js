#!/bin/env node

var application_root = __dirname,
    request          = require('request'),
    express          = require('express'), //Web framework
    morgan           = require('morgan'), // (since Express 4.0.0)
    bodyParser       = require('body-parser'), // (since Express 4.0.0)
    errorHandler     = require('errorhandler'), // (since Express 4.0.0)
    path             = require( 'path' ), // Utilities for dealing with file paths
    fs               = require('fs'),
    app              = express();

// Configure server (since Express 4.0.0)
var env = process.env.NODE_ENV || 'development';

if ('development' == env) {

    app.use('/', express.static(path.join(application_root, 'app')));
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
};


//Start server
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8000;

app.set('ipaddr', ipaddr);
app.set('port', port);

var server = app.listen( port, ipaddr, function() {
    console.log( 'Express server listening on port %d in %s mode',
        port, app.settings.env );
});


var sanitize = function (string) {

    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(client) {

    client.emit('news', {hello: 'sending news from server'});
    client.on('test', function (data) {

        console.log(data);
    });
});



//app.get('/api', function(request, response) {
//
//    response.sendFile(__dirname+'/app/index.html');
//});


// Get a list of all messages
//app.get('/traffic-events', function(req, res) {
//
//    //fs.createReadStream('traffic.json').pipe(request.put('http://api.sr.se/api/v2/traffic/messages?format=json&indent=true'));
//
//    //var destFile = fs.createWriteStream('traffic.json');
//    //var jsonString = JSON.stringify(request.get('http://api.sr.se/api/v2/traffic/messages?format=json&indent=true'), null, 4);
//    //fs.createReadStream(jsonString).pipe(destFile);
//    //
//    //fs.writeFile()
//
//
//    //console.log(request.get('http://api.sr.se/api/v2/traffic/messages?format=json&indent=true'));
//
//    request('http://api.sr.se/api/v2/traffic/messages?format=json&indent=true&size=1000', function (error, response, body) {
//
//        if (!error && response.statusCode == 200) {
//
//            fs.writeFile('traffic.json', body);
//            //console.log(typeof body);
//            //console.log(JSON.parse(body));
//            res.send(JSON.parse(body));
//        }
//        else {
//            //console.log('error');
//            res.send('error');
//        }
//    });
//
//});

app.get('/development', function(req, res) {

    res.send(JSON.parse(fs.readFileSync('traffic.json')));
});
//http://api.sr.se/api/v2/programs?format=json&indent=false&page=2
//http://api.sr.se/api/v2/traffic/messages?format=json&indent=true;