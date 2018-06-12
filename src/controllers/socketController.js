const io = require('../../mybuddy-bacnkend-server').io;

const { USER_CONNECTED, USER_DISCONNECTED, LOGOUT, COMMUNITY_CHAT } = require('../Events')
const { createChat } = require('../middleware')

let connectedUser = {}
let communityChat = createChat();

module.exports = (socket) => {
    console.log('Socket ID: ' + socket.id);

    socket.on('chatroom', (sender, recipient, message) => {
        console.log('I am user:' + sender + ' and want to chat with: ' + recipient);
        console.log(message);
    });

    socket.on(USER_CONNECTED, (sender, recipient, message) => {
        console.log('I am user:' + sender + ' and want to chat with: ' + recipient);
        console.log(message);
    });

    socket.on('disconnect', () => {
        delete connectedUser[socket.username]
        console.log('Disconnect', connectedUser);
    });

    socket.on('example_message', (msg) => {
        console.log('message: ' + msg.message);
    });

    //reroute message send from sender to recipient if he is online
    socket.on('private_message', (message) => {
        console.log("sender: " + message.sender);
        console.log("recipient: " + message.recipient);
        console.log("message: " + message.message);
        console.log(connectedUser)
        if (connectedUser[message.sender] === undefined) {
            socket.emit('user_offline');
            //TODO: save messages in chat history for recipient to recieve upon login
        }
        else {
            socket.to(connectedUser[message.recipient]).emit('private_message', message)
        }
    });

    //add client to list of connected users
    socket.on('login', (username) => {
        socket.username = username;
        if(connectedUser[username] === undefined) {
            connectedUser[socket.username] = socket.id
        }
        console.log('Connect', connectedUser);
    });

    //remove client from list of connected ssers
    socket.on('logout', () => {
        delete connectedUser[socket.username];
        console.log('Disconnect', connectedUser);

    });


    socket.on(COMMUNITY_CHAT, (callback) => {
        callback(communityChat);
    })

};
