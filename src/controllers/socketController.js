const io = require('../../mybuddy-bacnkend-server').io;

const { LOGOUT, SEND_PRIVATE_MESSAGE, RECEIVE_PRIVATE_MESSAGE, LOGIN, USER_DISCONNECTED, USER_RECONNECTED, CREATE_NEW_CHAT, RECEIVE_NEW_CHAT } = require('../Events')
const { createMessage, createChat } = require('../middleware')

connectedUsers = {}; //dictionary of users with their respective socketid

module.exports = (socket) => {
    console.log('Socket ID: ' + socket.id);

    socket.on('disconnect', () => {
        delete connectedUsers[socket.username];
        console.log('disconnect', connectedUsers);
    });

    socket.on(USER_RECONNECTED, (username) => {
        if(username) {
            socket.username = username;
            connectedUsers[socket.username] = socket.id;
        }
        console.log('Reconnected', connectedUsers);
    });

    socket.on(USER_DISCONNECTED, () => {
        connectedUsers[socket.username];
        console.log('Disconnected', connectedUsers);
    });

    //add client to list of connected users
    socket.on(LOGIN, (username) => {
        socket.username = username;
        if(connectedUsers[username] === undefined) {
            connectedUsers[socket.username] = socket.id;
        }
        console.log('Login', connectedUsers);
        //TODO: Load all chats from
    });

    //remove client from list of connected ssers
    socket.on(LOGOUT, () => {
        delete connectedUsers[socket.username];
        console.log('Logout', connectedUsers);
    });

    //reroute message send from sender to receiver if he is online
    socket.on(SEND_PRIVATE_MESSAGE, ({ chatid, sender, receiver, message}) => {
        if (connectedUsers[receiver] === undefined) {
            console.log('Send Message', connectedUsers[receiver]);
            socket.emit('user_offline');
            //TODO: save messages in chat history for receiver to receive upon login
        }
        else {
            let newMessage = {
                chatid,
                sender,
                receiver,
                message: createMessage({message: message, sender:sender})
            }
            socket.to(connectedUsers[receiver]).emit(RECEIVE_PRIVATE_MESSAGE, newMessage); //send message to receiver
            socket.emit(RECEIVE_PRIVATE_MESSAGE, newMessage); //send message back to sender
            //TODO: save messages in chat history for receiver to receive upon login
        }
        //console.log('Message', message);
    });

    socket.on(CREATE_NEW_CHAT, ({receiver, sender}) => {
        //TODO: Find chat in database, else create a new one
        let newChat = createChat({name:`${receiver}&${sender}`, users: [receiver, sender], messages: []})
        let receiverid = connectedUsers[receiver];
        socket.to(receiverid).emit(RECEIVE_NEW_CHAT, newChat);
        socket.emit(RECEIVE_NEW_CHAT, newChat);

        /*
        * if() {
        *   //get chat from database
        * }
        * else {
        *   const newChat =  createChat({name: `$(message.receiver)&$(message.sender)`, users: [message.receiver, message.sender]})
        *   const socketid = connectedUsers[receiver]
        *   socket.to(socketid).emit(SEND_PRIVATE_MESSAGE, newChat) //send new chat to receiver
        *   socket.emit(SEND_PRIVATE_MESSAGE, newChat) //send new chat to self
        * }
        */
    })

    socket.on('test', (msg) => {
        console.log('message: ' + msg.message);
    });
};

//send message to a specific chat
function sendMessageToChat(sender){
    return (chatId, message)=>{
        io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
    }
}