//Init socket
const socket = io();
const ui = new UI();

const loginForm = document.forms['login-form'];
const userName = loginForm.elements['username'];
const messageForm = document.forms['send-message'];
const message = messageForm.elements['message'];
const roomList = document.querySelector('.rooms-list');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if(userName.value) {
        const name = userName.value;
        socket.emit('new user', name);
        ui.hideLogin();
        ui.showAuthorized();
    }
});
messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if(message.value) {
        const msg = message.value;
        socket.emit('message', msg);
    }
});
roomList.addEventListener('click', function (e) {
    e.preventDefault();
    if(e.target.dataset.roomIndex) {
        let index = e.target.dataset.roomIndex;
        socket.emit('roomchange',index);
    }
})

// Sockets events
socket.on('welcome', (user)=>{
   currentRoom = user.data.room;
   ui.setUserInfo(user);
});
socket.on('new user joined', (user) =>{
    ui.joinedUser(user);
});
socket.on('has left room', (user)=>{
    ui.leftUser(user);
});
socket.on('rooms', (rooms)=>{
    ui.generateRooms(rooms);
});
socket.on('updateusers', (users)=>{
    console.log('updateusers',users);
    ui.generateUsersRooms(users.usernames,users.room);
});
socket.on('chat message', (msg)=>{
    ui.addMessage(msg.data);
});
socket.on('chat message own', (msg)=>{
    ui.addMessage(msg.data);
});
socket.on('roommates', (data)=>{
    //console.log('roomates',data);
});