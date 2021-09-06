// TODO: Include note about how this backend should not be used in a production environment

const express = require("express");
const app = express();
const http = require("http");
const httpProxy = require("http-proxy");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3002;

// TODO: Add SocketAPI routes
io.on("connection", (socket) => {
  console.log("a user connected");
});

const proxyServer = httpProxy.createProxyServer();

const FRONTEND_PROXY_URL = process.env.FRONTEND_PROXY_URL;

app.get("/*", (req, res) => {
  proxyServer.web(req, res, { target: FRONTEND_PROXY_URL }, (err) => {
    // TODO: Implement better frontend server error handling
    console.error(err);

    res.status(500).send("Frontend server offline");
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});