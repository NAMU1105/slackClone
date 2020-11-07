// TODO:
// 1. 메시지 보내면 맨 하단으로 스크롤 내리기
// 2. 메시지 포맷팅 하기(클래스 따로 만들기)!~!!!!!

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
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
socket.emit("joinRoom", { username, room });
// socket.emit("privateChatting", "test");

// Get room and users
// socket.on("roomUsers", ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// // Add users to DOM
// const outputUsers = (users) => {
//   userList.innerHTML = "";
//   users.forEach((user) => {
//     const li = document.createElement("div");
//     li.setAttribute("class", "user");
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// };

const showJoinedUsersInfo = (usersArray) => {
  const lis = document.querySelectorAll(".user");
  console.log("lis.legnth: ", lis.length);
  console.log("lis: ", lis);
  //   console.log("usersArray.legnth: ", usersArray.length);

  //   if (usersArray.length !== 0) {
  //   clear user list
  for (let i = 0; i < lis.length; i++) {
    console.log("i: ", i);

    lis[i].remove();
  }
  //   }

  //   add user list to DOM
  usersArray.map((user) => {
    //   console.log(`user: ${JSON.stringify(user.username)}`);
    const li = document.createElement("div");
    li.setAttribute("class", "user");
    li.setAttribute("id", user.id);
    li.innerText = user.username;
    userList.appendChild(li);
  });
};

const addMessageToDom = (msg) => {
  const div = document.createElement("div");
  const userName = document.createElement("span");
  const time = document.createElement("span");
  const message = document.createElement("span");
  time.innerText = msg.text;
  userName.innerText = msg.username;
  //   const sentTime = moment().format("h:mm a");
  //   message.innerText = `15:35`;
  message.innerText = msg.time;
  div.appendChild(userName);

  div.appendChild(time);
  div.appendChild(message);
  messages.appendChild(div);
};

const showRoomInfo = (roomName) => {
  headerRoomName.innerText = roomName;
};

// **************************************************
// show joined user list
// **************************************************
socket.on("showUserList", (userList) => {
  console.log("showUserList");

  //   Output user list to DOM
  showJoinedUsersInfo(userList);
});

// **************************************************
// show room name(info)
// **************************************************
showRoomInfo(room);

// **************************************************
// show messages
// **************************************************
socket.on("message", function (msg) {
  console.log(`msg: ${msg}`);

  //   Output message to DOM
  addMessageToDom(msg);
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

// **************************************************
// click events
// **************************************************
userList.addEventListener("click", (e) => {
  // private chatting starts

  const userID = e.target.id;

  if (e.target.classList.contains("user")) {
    // console.log(e.target.id);
    location.href = "/private.html?room=" + room + "&userno=" + userID;
    // location.href = "/private.html?no=" + userID;
  }
});
