const socket = io("http://localhost:3000");

// socket.emit("registeruser", { userId: "UID" });

let messageInput = document.querySelectorAll(".message")[0];
let divEl = document.querySelector("#messages");
function sendMessage() {
  const newMessage = messageInput.value;
  console.log(newMessage);
  socket.emit("new_chat", {
    message: newMessage,
    senderId: "",
    receiverId: "",
  });
}

socket.on("new_chat", (newMessage) => {
  console.log("new message received", newMessage);
  divEl.innerHTML += `<h3>${newMessage.message}</h3>`;
});

let email = document.querySelectorAll(".email")[0];
let password = document.querySelectorAll(".password")[0];
async function register() {
  try {
    const { data } = await axios.post("http://localhost:3000/auth/register", {
      fullname: `Abdullah ${Math.floor(Math.random() * 10)}`,
      email: email.value,
      password: password.value
    })

    console.log('user registered', data);
  } catch (e) {
    console.log(e, 'error')
  }
}
async function login() {

  try {
    const { data } = await axios.post("http://localhost:3000/auth/login", {
      email: email.value,
      password: password.value
    })

    console.log('user registered', data);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    registerUserToSocket();


  } catch (e) {
    console.log(e, 'error')
  }

}

let user;
registerUserToSocket();
function registerUserToSocket() {
  user = JSON.parse(localStorage.getItem("user"))
  if (user) {
    socket.emit("register_user", {
      user: user
    })
  }


}

// socket.on('fetch_messages', (previousChat) => {
//   console.log(previousChat);
// });

// socket.emit("send_message", {
//   message,
//   senderId,
//   receiverId,
//   messageType,
//   read,
//   sentTime
// })

let firendListContainer = document.querySelectorAll(".friend-list-container")[0];
socket.on("fetch_users", ({ friendList }) => {
  console.log(friendList);

  friendList.forEach(({ email, _id }) => {

    firendListContainer.innerHTML += `<br /><button onclick="startChat('${_id}', '${email}')">${email}</button><br />`


  })

})

let receiverId;
let chatRecepientEl = document.querySelectorAll('.chat-recepient')[0];
let newChatDiv = document.querySelectorAll('.new-msg-container')[0];

function startChat(uid, email) {
  console.log('start chat', uid);
  chatRecepientEl.innerHTML = `Chat started with: ${email}`
  receiverId = uid;
  newChatDiv.style.display = "block";
  socket.emit("fetch_prev_chat", { receiverId, senderId: user._id });

}

let newMessage = document.querySelectorAll('.new-message')[0];
function sendNewMessage() {
  let newMsg = newMessage.value;
  let data = {
    message: newMsg,
    senderId: user._id,
    receiverId,
  }
  socket.emit('new_message', data);
  renderChat(data);
  newMessage.value = "";
}

socket.on('send_message', (data) => {
  console.log('new chat received', data);
  renderChat(data);
})


let messagesList = document.querySelectorAll('.messages')[0];

function renderChat(chat) {
  console.log(chat, 'new message');
  if (chat.senderId === user._id) {
    messagesList.innerHTML += `<p class="own-message">${chat.message}</p>`;
  }
  else {
    messagesList.innerHTML += `<p class="others-message">${chat.message}</p>`;
  }
}