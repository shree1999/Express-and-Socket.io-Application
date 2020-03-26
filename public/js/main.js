const socket = io();
const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room});

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const msg = event.target.elements.msg.value;

  socket.emit('chatMessages', msg);
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', message => {
  outputToDom(message); 
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputRoomName(room) {
  roomName.innerHTML = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

function outputToDom(message) {
  const div = document.createElement('div');
  div.classList.add('message');

  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                   <p class="text"> ${message.message} </p>`;

  document.querySelector('.chat-messages').appendChild(div);
}

