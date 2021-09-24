// @see https://gist.github.com/steinwaywhw/9920493

import {
  EVT_DATA as EVT_SOCKET_CHANNEL_DATA,
  EVT_DESTROYED as EVT_SOCKET_CHANNEL_DESTROYED,
} from "@shared/SocketChannel";
import os from "os";
const pty = require("node-pty");

// TODO: Document
// TODO: Require another socket channel for meta / control communications (i.e.
// to know when UI terminal is resized, etc.) or use some other internal event
// on this same socket channel?
export default function bindPtySocketChannel(socketChannel) {
  const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

  // Create shell process
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",

    // TODO: Set these dynamically (i.e. ptyProcess.resize(100, 40);)
    cols: 80,
    rows: 15,

    cwd: process.env.HOME,
    env: process.env,

    encoding: "utf-8",
  });

  // STDIN from socket
  socketChannel.on(EVT_SOCKET_CHANNEL_DATA, data => {
    ptyProcess.write(data);
    // ptyProcess.write(socketChannel.ab2str(data));
  });

  // STDOUT from process
  ptyProcess.on("data", data => {
    socketChannel.write(data);
    // socketChannel.write(socketChannel.str2ab(data));
  });

  ptyProcess.on("exit", () => {
    socketChannel.disconnect();
  });

  socketChannel.on(EVT_SOCKET_CHANNEL_DESTROYED, () => {
    ptyProcess.kill();

    console.log("bye");
  });

  // console.log('socketChannelId', socketChannelId);

  // ptyProcess.write('ls\r');
  // ptyProcess.resize(100, 40);
  // ptyProcess.write('ls\r');

  // return new Date();
}
