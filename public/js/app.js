//Init socket
const socket = io();

const loginForm = document.forms['login-form'];
const userName = loginForm.elements['username'];
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if(userName.value) {
        const name = userName.value;
        socket.emit('new user', name);
    }
});

// Sockets events
socket.on('welcome', (room)=>{
   console.log(room);
});