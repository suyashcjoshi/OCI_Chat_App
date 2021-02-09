const socket = io();

const form = document.querySelector("#form");
const inputElem = document.querySelector("#input-field");
const chatBox = document.querySelector("#message-box");

let userName = "";

// Attach event to the form and sent websocket message when form is submitted
form.addEventListener("submit", function(e) {
  let chatMsg = inputElem.value;
  // prevent default behavior of page reloading 
  if (e.preventDefault) { 
    e.preventDefault();
  }
  socket.emit("client-chat", {"username" : userName, "chatMessage" : chatMsg});
  inputElem.value = "";
  return false;
});

socket.on("welcome-message", (msg) => {
  printMessage(msg, "welcome-message");
});

socket.on("relay-message", (msg) => {
  printMessage(msg, "relay-message");
});

socket.on("client-name", (msg) => {
  userName = msg;
  printMessage(msg, "client-name");
});

// Helper function to print new chat messages along with time stamp
const printMessage = function (msg, msgType) {
  const messageEntry = document.createElement("li");
  const smallText = document.createElement("small");
  let messageText = "";
  let curTime = new Date().toLocaleTimeString();
  curTime = curTime.slice(0, -2); // remove the 'am/pm' from time stamp
  
  // first time user will be greeted by the welcome message before rest of the chat is presented
  switch (msgType) {
    case "welcome-message":
      messageText = "HOST : " + msg;
      messageEntry.innerHTML = messageText;
      smallText.innerHTML = curTime;
      messageEntry.insertAdjacentElement("afterbegin", smallText);
      chatBox.appendChild(messageEntry);
      break;
    case "relay-message":
      messageText = msg.username + " : " + msg.chatMessage;
      messageEntry.innerHTML = messageText;
      smallText.innerHTML = curTime;
      messageEntry.insertAdjacentElement("afterbegin", smallText);
      chatBox.appendChild(messageEntry);
      break;
    default :
      break;
  }
}
  
