const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const auth = require("./auth");
const humanNames = require("human-names");

// Express app using HTTP and websocket servers
const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

let numOfConnections = 0;

// Serving static files from "public" directory after authentication
const publicDirPath = path.join(__dirname, "../public");
app.use(auth);
app.use(express.static(publicDirPath));

// websocket connection established
io.on("connection", (socket) => {
  console.log("Websocket connected!");
  numOfConnections++; // naive count that will be incremented everytime page is loaded
  // send welcome message to connected client
  socket.emit("welcome-message", "Welcome to the chat!");
  socket.emit("client-name", humanNames.allRandom());

  // recieve the client chat message and broadcast to all clients
  socket.on("client-chat", (msg) => {
    console.log(msg.username + msg.chatMessage);
    io.emit("relay-message", msg);
  });
});
// websocket connection lost
io.on("disconnect", () => {
    console.log("Websocket disconnected");
});

server.listen(port, "0.0.0.0", function() {
  console.log(`Server is now running on http://localhost:${port}`);
});