const io = require('../../mybuddy-bacnkend-server').io;

const connectedUser = {}

module.exports = (socket) => {
    console.log('Socket ID: ' + socket.id);

    socket.on('chatroom', (sender, recipient, message) => {
        console.log('I am user:' + sender + ' and want to chat with: ' + recipient);
        console.log(message);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');

    });

    socket.on('example_message', (msg) => {
        console.log('message: ' + msg.message);
    });

    socket.on('private_message', (message) => {
        console.log("sender: " + message.sender);
        console.log("recipient: " + message.recipient);
        console.log("message: " + message.message);
        console.log(connectedUser)
        if (connectedUser[message.sender] === undefined) {
            socket.emit('user_offline');
        }
        else {
            socket.to(connectedUser[message.recipient]).emit('private_message', message)
        }
    });

    socket.on('login', (username) => {
        socket.username = username;
        if(connectedUser[username] === undefined) {
            connectedUser[socket.username] = socket.id
        }
        console.log(connectedUser)
    });

    socket.on('logout', (username) => {
        delete connectedUser[username];
    });
};