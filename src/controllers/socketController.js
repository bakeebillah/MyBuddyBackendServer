const io = require('../../mybuddy-bacnkend-server').io;
const chatModel = require('../models/chatModel');

const { LOGOUT, SEND_PRIVATE_MESSAGE, RECEIVE_PRIVATE_MESSAGE, LOGIN, USER_DISCONNECTED, USER_RECONNECTED, CREATE_NEW_CHAT, RECEIVE_NEW_CHAT, RECEIVE_ALL_CHATS } = require('../Events')
const { createMessage, createChat } = require('../middleware')

connectedUsers = {}; //dictionary of users with their respective socketid

module.exports = (socket) => {
    console.log('Socket ID: ' + socket.id);
    socket.on('disconnect', () => {
        delete connectedUsers[socket.username];
        console.log('disconnect', connectedUsers);
    });

    socket.on("CONNECT", (user) => {
        if(user) {
            socket.username = user.username;
            connectedUsers[socket.username] = socket.id;
        }
        console.log('Reconnected', connectedUsers);
        chatModel.find({
            users: user.username
        })
            .then((chats)=> {
                console.log("found a few chats", chats);
                socket.emit(RECEIVE_ALL_CHATS, chats)
            })
            .catch((error)=> {
                console.log("something happened trying send all messages", error);
            })

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

    //reroute message send from sender to receiver if he is online
    socket.on(SEND_PRIVATE_MESSAGE, ({ chatid, sender, receiver, message}) => {
        if (connectedUsers[receiver] === undefined) {
            console.log('Send Message', connectedUsers[receiver]);
            socket.emit('user_offline');
            //TODO: save messages in chat history for receiver to receive upon login
        }
        else {
            let newMessage = createMessage({message: message, sender:sender});

            let messageToSend = {
                chatid,
                sender,
                receiver,
                message: newMessage
            }

            addToChat(newMessage, chatid);
            socket.to(connectedUsers[receiver]).emit(RECEIVE_PRIVATE_MESSAGE, messageToSend); //send message to receiver
            socket.emit(RECEIVE_PRIVATE_MESSAGE, messageToSend); //send message back to sender
            //TODO: save messages in chat history for receiver to receive upon login
        }
        //console.log('Message', message);
    });

    socket.on(CREATE_NEW_CHAT, ({receiver, sender}) => {
        //TODO: Find chat in database, else create a new one
        let receiverid = connectedUsers[receiver];
        chatModel.findOne({
            users: [receiver, sender]
        })
            .then((chat)=> {
                if(chat !== null) {
                    console.log("found the chat", chat)
                    socket.to(receiverid).emit(RECEIVE_NEW_CHAT, chat);
                    socket.emit(RECEIVE_NEW_CHAT, chat);
                }
                else
                    throw new Error("Something went wrong");
            })
            .catch(()=> {
                console.log("create new chat")
                let newChat = createChat({name:`${receiver}&${sender}`, users: [receiver, sender], messages: []})
                saveChat(newChat)
                socket.to(receiverid).emit(RECEIVE_NEW_CHAT, newChat);
                socket.emit(RECEIVE_NEW_CHAT, newChat);
            })
    })

    socket.on('test', (msg) => {
        console.log('message: ' + msg.message);
    });
};

function saveChat(chat) {
    chatModel.create(chat)
        .then(()=> {
            console.log("saving successful");
        })
        .catch((error)=> {
            console.log("something happened creating the chat", error);
        })
}

function addToChat(message, chatid) {
    chatModel.updateOne(
            { "id" : chatid },
            { $push: { messages: message}}
        ).then(() => {
            console.log("adding message successful");
        })
        .catch((error)=> {
            console.log("something happened trying to add the message", error);
        })
}

function sendAllChats(user) {
    chatModel.find({
        users: user
    })
        .then(()=> {
            console.log("found a few chats");
        })
        .catch((error)=> {
            console.log("something happened trying to add the message", error);
        })

}
