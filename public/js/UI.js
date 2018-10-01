class UI {
    constructor() {
        this.login = document.querySelector('.login');
        this.authorized = document.querySelector('.authorized');
        this.roomList = document.querySelector('.rooms-list');
        this.usersList = document.querySelector('.user-list');
        this.messageContainer = document.querySelector('.message-container');
        this.usernameInfo = document.querySelector('.usernameInfo');
    }

    showLogin() {
        this.login.style.display = 'block';
    }

    hideLogin() {
        this.login.style.display = 'none';
    }

    showAuthorized() {
        this.authorized.style.display = 'block';
    }

    hideAuthorized() {
        this.authorized.style.display = 'none';
    }

    setUserInfo(user) {
        let data = {
            username: 'roomBot',
            msg: `You Welcome in room: ${user.data.room}`,
            own: false,
        }
        this.addMessage(data);
        this.usernameInfo.innerHTML = user.username;
        this.usernameInfo.setAttribute('data-id', user.data.id);
    }

    leftUser(user) {
        console.log('left', user);
        let data = {
            username: 'roomBot',
            msg: `${user} has left the room `,
            own: true,
        }
        this.addMessage(data);
    }

    joinedUser(user) {
        let data = {
            username: 'roomBot',
            msg: `In our room joined user: ${user.username}`,
            own: true,
        }
        this.addMessage(data);
    }

    generateRooms(rooms) {
        this.clearRooms();
        if (rooms.length === 0) {
            return false;
        }
        rooms.forEach((room, index) => {
            this.roomList.insertAdjacentHTML('beforeend', UI.roomListTemplate(room, index));
        });
    }

    generateUsersRooms(users, room) {
        this.clearUsers();
        for (let user in users) {
            if (users.hasOwnProperty(user) && room === users[user].room) {
                this.usersList.insertAdjacentHTML('beforeend', UI.usersListTemplate(user, users[user]));
            }
        }
    }

    clearUsers() {
        this.usersList.innerHTML = '';
    }

    clearRooms() {
        this.roomList.innerHTML = '';
    }

    addMessage(data) {
        this.messageContainer.insertAdjacentHTML('beforeend', UI.messageTemplate(data));
    }

    static roomListTemplate(room, index) {
        return `<li><a href="#" class="waves-effect" data-room-index="${index}">${room}</a></li>`;
    }

    static usersListTemplate(user, info) {
        return `<li class="collection-item" data-user-id="${info.id}"><a href="#" class="waves-effect">${user}</a></li>`;
    }

    static messageTemplate(data) {
        let classOwn = 'to';
        if (data.own) {
            classOwn = 'from';
        }
        return `<div class="message ${classOwn}">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                            <span>${data.username} :</span> ${data.msg}
                        </div>
                    </div>
                 </div>`;
    }
}