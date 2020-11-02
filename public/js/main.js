// TODO:
// 1. 메시지 보내면 맨 하단으로 스크롤 내리기

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

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

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
  console.log("usersArray.legnth: ", usersArray.length);

  if (usersArray.length !== 0) {
    //   clear user list
    for (let i = 0; i < lis.length; i++) {
      lis[i].remove();
    }
  }

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

socket.on("message", function (
  msg,
  testUserName,
  roomName = "",
  joinedUsersArray = []
) {
  console.log(`msg: ${msg}`);
  console.log(`roomName: ${roomName}`);
  console.log(`testUserName: ${testUserName}`);
  console.log(`joinedUsersArray: ${JSON.stringify(joinedUsersArray)}`);
  console.log(`joinedUsersArray.length: ${joinedUsersArray.length}`);
  //   Output message to DOM
  // $("#messages").append($("<li>").text(msg));
  addMessageToDom(msg, testUserName);

  //   방정보 보여주기
  //   이건 한 번만 보여주면 되지 않나?
  //   여기에 있으면 매번 메시지 이벤트가 호출 될 때마다 시행되니까 안 좋은 듯
  showRoomInfo(room);
  if (joinedUsersArray.length != 0) {
    // 대화에 참가하는 유저 보여주기
    showJoinedUsersInfo(joinedUsersArray);
  }
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
  if (e.target.classList.contains("user")) {
    // console.log(e.target.id);
  }
});
