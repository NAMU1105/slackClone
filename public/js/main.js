// TODO:
// 1. 스크롤 내리기

const chatForm = document.querySelector("#chatForm");
const socket = io();

const messages = document.querySelector("#messages");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
socket.emit("joinRoom", { username, room });

const addMessageToDom = (msg, testUserName) => {
  const div = document.createElement("div");
  const userName = document.createElement("span");
  const time = document.createElement("span");
  const message = document.createElement("span");
  time.innerText = msg;
  userName.innerText = testUserName;
  message.innerText = `15:35`;
  div.appendChild(userName);
  div.appendChild(time);
  div.appendChild(message);
  messages.appendChild(div);
};

socket.on("chat message", function (msg, testUserName) {
  console.log(`msg: ${msg}`);
  console.log(`testUserName: ${testUserName}`);
  //   Output message to DOM
  // $("#messages").append($("<li>").text(msg));
  addMessageToDom(msg, testUserName);
});
// });

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log(e.target.elements.msg.value);

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  //   socket.emit("chatMessage", msg);
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
