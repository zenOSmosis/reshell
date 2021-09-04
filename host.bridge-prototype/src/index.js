const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// TODO: Add SocketAPI routes
io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3002, () => {
  console.log("listening on *:3002");
});
