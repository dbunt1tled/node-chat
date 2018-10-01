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
        //send who make qequest
        socket.emit('welcome', {data:usernames[name],username:socket.username});
        // send all in room except myself
        socket.broadcast.to(socket.room).emit('new user joined', {username:socket.username});
        // send all in room
        // io.sockets.in(socket.room).emit('Yo',{username:socket.username});
        io.emit('roommates', {usernames, room: socket.room});

        io.emit('updateusers', {usernames: usersInRoom(usernames,socket.room), room: socket.room});

    });
    socket.on('disconnect', () => {});
    socket.on('message', msg => {
        let data = usernames[socket.username];
        data.msg = msg;
        data.username = socket.username;
        data.own = true;
        socket.emit('chat message own', {data});
        data.own = false;
        socket.broadcast.to(socket.room).emit('chat message', {data});
    });
    socket.on('roomchange', index => {
        let oldRoom = socket.room;
        socket.broadcast.to(oldRoom).emit('userswitchedroom', {
            usernames, name: socket.username, room: socket.room,
        });
        socket.leave(socket.room);

        socket.room = rooms[index];
        usernames[socket.username].room = rooms[index];
        socket.join(socket.room);
        socket.emit('welcome', {data:usernames[socket.username],username:socket.username});
        socket.broadcast.to(socket.room).emit('new user joined', {username:socket.username});
        io.emit('roommates', {usernames: usersInRoom(usernames,socket.room), room: socket.room});

        io.emit('updateusers', {usernames: usersInRoom(usernames,socket.room), room: socket.room});
        socket.broadcast.to(oldRoom).emit('has left room', socket.username);
        socket.broadcast.to(oldRoom).emit('updateusers', {usernames: usersInRoom(usernames,oldRoom), room: oldRoom});


    });

    function usersInRoom(users,room) {
        let resultUser = {};
        for(let user in users) {
            if(usernames.hasOwnProperty(user) && users[user].room === room){
                resultUser[user] = users[user]
            }
        }
        return resultUser;
    }
});