"use strict";
const http = require ('http');
const mongoose   = require('mongoose');
const api = require('./src/api');
const config = require('./src/configaration');

// set the port to the API
api.set('port',config.port);

// Create a http server
const server = http.createServer(api);
const io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('User Disconnected');
    });

    socket.on('example_message', function(msg){
        console.log('message: ' + msg);
    });
});
io.listen(8000);

mongoose
    .connect(config.mongoURI)
    .then(() => server.listen(config.port))
    .catch(err => {
        console.log('Error connecting to the database', err.message);
        process.exit(err.statusCode);
    });

server.on('listening', () => {

  //  console.log(`${config.basicRouteMessage} is running in port ${config.port}`);
    console.log('\x1b[44m\n\n\t\t\t'+ config.basicRouteMessage + ' is running on port '+ config.port+'\x1b[0m');
});

server.on('error', (err) => {
    console.log('Error in the server', err.message);
    process.exit(err.statusCode);
});


