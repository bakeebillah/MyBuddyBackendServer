const io = require('../../mybuddy-bacnkend-server').io;
const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');

const { LOGOUT, SEND_PRIVATE_MESSAGE, RECEIVE_PRIVATE_MESSAGE, LOGIN, USER_DISCONNECTED, USER_RECONNECTED,
    CREATE_NEW_CHAT, RECEIVE_NEW_CHAT, RECEIVE_ALL_CHATS} = require('../Events');
const { createMessage, createChat } = require('../middleware');

connectedUsers = {}; //dictionary of users with their respective socketid

module.exports = (socket) => {
    //console.log('Socket ID: ' + socket.id);

    //create a socket listener, waiting for disconnect
    socket.on('disconnect', () => {
        //delete disconnected user from list of connected users
        delete connectedUsers[socket.userName];
        console.log('disconnect', connectedUsers);
    });

    //create a socket listener, waiting for a user to connect and add him to the current list of currently connected users
    socket.on("CONNECT", (user) => {
        if(user) {
            socket.userName = user.userName;
            connectedUsers[socket.userName] = socket.id;
        }
        console.log('Reconnected', connectedUsers);
        //find chats the user in part of
        chatModel.find({
            users: user.userName
        })
            .then((chats)=> {
                console.log("found a few chats", chats);
                socket.emit(RECEIVE_ALL_CHATS, chats)
            })
            .catch((error)=> {
                console.log("something happened trying send all messages", error);
            })
    });

    //create a socket listener, waiting for disconnect
    socket.on(USER_DISCONNECTED, () => {
        //delete disconnected user from list of connected users
        connectedUsers[socket.userName];
        console.log('Disconnected', connectedUsers);
    });

    //add client to list of connected users
    socket.on(LOGIN, (userName) => {
        socket.userName = userName;
        if(connectedUsers[userName] === undefined) {
            //add current socket id with user to list of connected users
            connectedUsers[socket.userName] = socket.id;
        }
        console.log('Login', connectedUsers);
    });

    //receives a message and adds the message to chat and returns it to the sender
    socket.on(SEND_PRIVATE_MESSAGE, ({ chatid, sender, receiver, message}) => {
        //if the user is not online, save the message in chat and only send back to sender
        if (connectedUsers[receiver] === undefined) {
            //create a new message object
            let newMessage = createMessage({message: message, sender:sender});
            //create a new message json for sender/receiver
            let messageToSend = {
                chatid,
                sender,
                receiver,
                message: newMessage
            };
            addToChat(newMessage, chatid);
            //send message to sender
            socket.emit(RECEIVE_PRIVATE_MESSAGE, messageToSend); //send message back to sender
        }
        //if user is online, save the message to chat and send to sender and receiver
        else {
            //create a new message object
            let newMessage = createMessage({message: message, sender:sender});
            //create a new message json for sender/receiver
            let messageToSend = {
                chatid,
                sender,
                receiver,
                message: newMessage
            };
            addToChat(newMessage, chatid);
            //send message to sender and receiver
            socket.to(connectedUsers[receiver]).emit(RECEIVE_PRIVATE_MESSAGE, messageToSend); //send message to receiver
            socket.emit(RECEIVE_PRIVATE_MESSAGE, messageToSend); //send message back to sender
        }
        //console.log('Message', message);
    });

    //create a new chat and save it in the database
    socket.on(CREATE_NEW_CHAT, ({receiver, sender}) => {
        let receiverid = '';
        if (receiver) {
            receiverid = connectedUsers[receiver];
        }
        else {
            let error = {
                error: "No receiver found",
                message: "Please specify a receiver"
            }
            socket.emit('ERROR', error);
            return;
        }
        userModel.findOne({
            userName: receiver
        })
            .then((user) => {
                if(user) {
                    chatModel.findOne({
                        users: { $all: [receiver, sender]}
                    })
                    //if there already is a chat send that chat to sender and receiver
                        .then((chat) => {
                            if (chat) {
                                console.log("found the chat", chat)
                                //send chat to sender and receiver
                                socket.to(receiverid).emit(RECEIVE_NEW_CHAT, chat);
                                socket.emit(RECEIVE_NEW_CHAT, chat);
                            }
                            else {
                                console.log("create new chat")
                                //create a new chat
                                let newChat = createChat({
                                    name: `${receiver}&${sender}`,
                                    users: [receiver, sender],
                                    messages: []
                                })
                                //save chat to database
                                console.log("saving new chat", newChat.id)
                                saveChat(newChat)
                                //send chat to sender and receiver
                                socket.to(receiverid).emit(RECEIVE_NEW_CHAT, newChat);
                                socket.emit(RECEIVE_NEW_CHAT, newChat);
                            }
                        })
                        //if there is not chat, create one and send it to sender and receiver
                        .catch(() => {
                            let error = {
                                error: 'Internal Server Error',
                                message: 'Error finding chat'
                            }
                            socket.emit('ERROR', error);
                        })
                }
                else {
                    let error = {
                        error: 'User not found',
                        message: 'User is not registered'
                    }
                    socket.emit('ERROR', error)
                }
            })
            .catch(() => {
                let error = {
                    error: 'Internal Server Error',
                    message: 'Error finding user'
                }
                socket.emit('ERROR', error);
            })
    });

    socket.on('test', (msg) => {
        console.log('message: ' + msg.message);
    });
};

//save the chat in database
function saveChat(chat) {
    chatModel.create(chat)
        .then(()=> {
            console.log("saving successful");
        })
        .catch((error)=> {
            console.log("something happened creating the chat", error);
        })
}

//add the message to chat
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

//send all existing chats the user is part of
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
