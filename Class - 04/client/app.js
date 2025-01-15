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
