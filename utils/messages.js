const moment = require("moment");

const formatMessage = (username, text) => {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
};

const addMessageToDom = (msg, ul) => {
  const div = document.createElement("div");
  const userName = document.createElement("span");
  const time = document.createElement("span");
  const message = document.createElement("span");
  time.innerText = msg.text;
  userName.innerText = msg.username;
  message.innerText = msg.time;
  div.appendChild(userName);
  div.appendChild(time);
  div.appendChild(message);
  ul.appendChild(div);
};

module.exports = formatMessage;
