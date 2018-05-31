"use restrict";



const port      = process.env.PORT        || '8080';
const mongoURI  = process.env.MONGODB_URI ||  'mongodb://127.0.0.1/mycomment';
const JwtSecret = process.env.JWT_SECRET  ||'AnetaBakeeChickenEviAreGood2018';
const basicRouteMessage = process.env.BASIC_ROUTE_MESSAGE || 'MyBuddy Backend Server';

module.exports = {
    port,
    mongoURI,
    JwtSecret,
    basicRouteMessage
};