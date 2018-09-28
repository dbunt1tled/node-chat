var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

const port = 3000;
const serverInstance = app.listen(port, () =>{
  console.log(`server runs on ${port}`);
});
const  io = require('socket.io').listen(serverInstance);
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(`${__dirname}/index.html`);
});

const usernames = {};
const rooms = ['room 1','room 2','some other room',];
const defaultRoom = rooms[0];

io.on('connection', socket =>{
    let isUser = false;
    socket.emit('rooms', rooms);
    socket.on('new user', name => {
        if(isUser) {
            return
        }
        socket.username = name;
        usernames[name] = {room:defaultRoom, id: socket.id};
        isUser = true;
        socket.room = defaultRoom;
        socket.join(defaultRoom);
        socket.emit('welcome', socket.room);
        socket.broadcast.to(socket.room).emit('new user joined', socket.username);

        io.emit('roommates', {usernames, room: socket.room});
        io.emit('updateusers', {usernames});

    });
    socket.on('disconnect', () => {});
    socket.on('message', msg => {});
    socket.on('roomchange', index => {});
});