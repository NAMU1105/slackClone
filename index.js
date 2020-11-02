// const app = require("express")();
const express = require("express");
const app = express();

const http = require("http").createServer(app);
const port = 3002 || process.env.PORT;
// initialize a new instance of socket.io by passing the http (the HTTP server) object.
// io는 socket.io 패키지를 import한 변수
const io = require("socket.io")(http);

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const admin = "Admin";
const welcomMessage = "Welcome";

// app.use(express.static(__dirname));
// app.use(express.static("/public"));
app.use(express.static(__dirname + "/public"));

// joined user list
// const users = [];

// TODO: TODOLIST
// 1. Broadcast a message to connected users when someone connects or disconnects.
// => done
// 2. Add support for nicknames.
// => done
// 3. Don’t send the same message to the user that sent it.
// Instead, append the message directly as soon as he/she presses enter.
// 4. Add “{user} is typing” functionality.
// => done
// 5. Show who’s online.
// => done
// 6. Add private messaging. 1대1 말하는건가?
// -> 유저 클릭하면 방으로 넘어가는 걸로 하기
// 7. Share your improvements!

////////////////////////////////////////////////
// 8. 기존에 보냈던 메시지들 보여주기
// 9. 타이핑 효과 더 스무스하게 보이게 만들기(중요도 하)
//

app.get("/", (req, res) => {
  // res.send("<h1>Hello world!!!  </h1>");
  res.sendFile(__dirname + "/index.html");
});
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/public/test.html");
});

// This will emit the event to all connected sockets
io.emit("some event", {
  someProperty: "some value",
  otherProperty: "other value",
});

io.on("connection", (socket) => {
  // socket은 커넥션이 성공했을 때 커넥션에 대한 정보를 담고 있는 변수

  // *********************************************
  // group chatting
  // *********************************************
  socket.on("joinRoom", ({ username, room }) => {
    console.log(`username: ${username}`);
    console.log(`room: ${room}`);

    const userID = socket.id;

    socket.join(room);

    // let joinedUser = {
    //   userID,
    //   room,
    //   username,
    // };

    // users.push(joinedUser);
    // console.log(`users: ${users}`);
    userJoin(userID, username, room);
    let roomUsers = getRoomUsers(room);

    socket.emit("message", welcomMessage, admin, room, roomUsers);

    // Broadcast when a user connects
    // socket.broadcast.emit("chat message", "A user entered", admin);
    // socket.broadcast.to(room).emit("chat message", "A user entered", admin);
    socket.broadcast
      .to(room)
      .emit(
        "message",
        `${username} has joined the chat`,
        admin,
        room,
        roomUsers
      );

    socket.on("disconnect", () => {
      // console.log("user disconnected");
      userLeave(userID);
      roomUsers = getRoomUsers(room);

      io.to(room).emit(
        "message",
        `${username} has left the chat`,
        admin,
        room,
        roomUsers
      );
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      // In this case, for the sake of simplicity we’ll send the message to everyone, including the sender.
      // io.emit("chat message", msg);
      io.to(room).emit("message", msg, username);
      console.log("message: " + msg);
    });
    socket.on("keyDown", () => {
      socket.broadcast.to(room).emit("typing", `${username}`);
    });
    // TODO: 여러 명이 타이핑 하다가 한명만 빠진 걸 수도 있으니 다시 새로 바뀐 타이핑 중인 리스트 보내주기
    socket.on("keyUp", () => {
      socket.broadcast.to(room).emit("doneTyping", `${username}`);
    });
  });

  // *********************************************
  // private chatting
  // *********************************************
  socket.on("privateChatting", ({ username, room }) => {});

  // If you want to send a message to everyone except for a certain emitting socket,
  // we have the broadcast flag for emitting from that socket:

  // 1. io.emit은 모든 사용자들에게 메시지 보냄, 그래서 여러 유저 들어올 때마다 웰컴 메시지가 계속 쌓임
  // io.emit("chat message", "welcome");
  // 2. socket.emit은 한 사람한테만 메시지 보냄? 그래서 메시지 안 쌓임 single client
  // socket.emit("chat message", "Welcome", admin);
  // socket.emit("chat message", "Welcome");
  // socket.broadcast.emit("chat message", "A user entered");
  // 3. socket.broadcast은 유저 빼고 모든 사람한테 보냄
  // socket.broadcast.emit("hi");
  // console.log("a user connected");

  // console.log(`socket: ${JSON.stringify(socket)}`);
  // console.log(`socket ID: ${socket.id}`);

  // // Listen for chatMessage
  // socket.on("chatMessage", (msg) => {
  //   // In this case, for the sake of simplicity we’ll send the message to everyone, including the sender.
  //   // io.emit("chat message", msg);
  //   io.to(room).emit("chat message", msg);
  //   console.log("message: " + msg);
  // });
});

// socket.on("disconnect", () => {
//   console.log("user disconnected");
//   io.emit("chat message", "A user has left the chat");
// });

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
