// TODO:
// getCurrentUser로 현재 대화하는 상대방 정보 얻기

const chatForm = document.querySelector("#chatForm");
const socket = io();

const messages = document.querySelector("#messages");
const typingSpan = document.querySelector(".typing-info > span");
const headerRoomName = document.querySelector("header > h1");
const userList = document.querySelector(".nav__users-list");

const keyDownOne = " is typing";
const keyDownTwo = " are typing";
const keyDownSeveral = "Several people are typing";

// Get username and room from URL
const { room, userno } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
// socket.emit("joinRoom", { username, room });
socket.emit("privateChatting", { room, userno });

// 상대방 정보를 보여주는 함수
const showJoinedUserInfo = (usersArray) => {
  // TODO: getCurrentUser로 현재 대화하는 상대방 정보 얻기
};

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

const showRoomInfo = (roomName) => {
  headerRoomName.innerText = roomName;
};

socket.on("message", function (msg, userno) {
  console.log(`msg: ${msg}`);
  addMessageToDom(msg, userno);
});

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

// **************************************************
// “{user} is typing” functionality
// **************************************************
const showWhoIsTyping = (testUserName) => {
  //   console.log(`show typing `);
  typingSpan.innerText = testUserName + keyDownOne;
};

const clearTypingInfo = () => {
  //   console.log(`clear typing `);
  typingSpan.innerText = "";
};

socket.on("typing", (testUserName) => {
  showWhoIsTyping(testUserName);
});
socket.on("doneTyping", (testUserName) => {
  clearTypingInfo();
});

chatForm.addEventListener("keydown", (e) => {
  //   console.log("keydown" + e);
  //   console.log(JSON.stringify(e));

  socket.emit("keyDown");
});

chatForm.addEventListener("keyup", (e) => {
  socket.emit("keyUp");

  clearTypingInfo();
});

// 누구와 채팅하는지 setText
showRoomInfo(room);
