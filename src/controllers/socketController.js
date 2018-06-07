const io = require('../../mybuddy-bacnkend-server').io;


const connectedUser = {}

module.exports = function(socket) {
    console.log("Socket Id:" + socket.id);

    socket.on('disconnect', function(){
        console.log('User Disconnected');
    });

    socket.on('example_message', function(msg){
        console.log('message: ' + JSON.stringify(msg));
    });

}