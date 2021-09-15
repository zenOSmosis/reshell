// TODO: ONLY FOR DEVELOPMENT MODE: Make wrapper script for CRA project, which
// uses this engine to manipulate / read its own filesystem; add Service API to
// phantom-core, and extend here, so backend services can be controlled from
// the frontend
//
// TODO: Include note about how this backend should not be used in a production
// environment

// TODO: Use this filewatcher?  https://github.com/paulmillr/chokidar (it is
// now used in Microsoft's Visual Studio Code, gulp, karma, PM2, browserify,
// webpack, BrowserSync, and many others)
// (Facebook also has one, which is not JS based:  https://github.com/facebook/watchman)

// TODO: Use zx package for internal script handling?  https://www.npmjs.com/package/zx

// TODO: Figure out how to skip Docker for this and still serve self-signed certs automatically (sort of how CRA does it): https://phongthaicao.medium.com/creating-an-https-server-with-node-js-using-a-self-signed-certificate-c90c86c5217

import express from "express";
import http from "http";
import httpProxy from "http-proxy";
import { Server } from "socket.io";
import SocketAPI from "./SocketAPI";

import bindSocketAPIRoutes from "./routes/socketAPI";

import SocketChannel, { EVT_DATA, EVT_CONNECTED } from "./shared/SocketChannel";

import path from "path";

// import dirDetail from "./socketFS/dirDetail";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.HOST_BRIDGE_PORT || 3002;

// TODO: Add SocketAPI routes
io.on("connection", (socket) => {
  // console.log("a user connected");

  const socketAPI = new SocketAPI(io, socket);
  bindSocketAPIRoutes(socketAPI);
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
