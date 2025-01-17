const socket = io("http://localhost:3000");

socket.emit("registeruser", { userId: "UID" });

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

registerUserToSocket();

function registerUserToSocket() {
  let user = JSON.parse(localStorage.getItem("user"))
  if (user) {
    socket.emit("register_user", {
      user: user
    })
  }


}

socket.on('fetch_messages', (previousChat) => {
  console.log(previousChat);
});

socket.emit("send_message", {
  message,
  senderId,
  receiverId,
  messageType,
  read,
  sentTime
})