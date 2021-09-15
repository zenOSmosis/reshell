// @see https://gist.github.com/steinwaywhw/9920493

import {
  EVT_DATA as EVT_SOCKET_CHANNEL_DATA,
  EVT_BEFORE_DISCONNECT as EVT_SOCKET_CHANNEL_BEFORE_DISCONNECT,
} from "@shared/SocketChannel";
import os from "os";
const pty = require("node-pty");

// TODO: Document
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
  socketChannel.on(EVT_SOCKET_CHANNEL_DATA, (data) => {
    ptyProcess.write(data);
    // ptyProcess.write(socketChannel.ab2str(data));
  });

  // STDOUT from process
  ptyProcess.on("data", (data) => {
    socketChannel.write(data);
    // socketChannel.write(socketChannel.str2ab(data));
  });

  ptyProcess.on("exit", () => {
    socketChannel.disconnect();
  });

  // TODO: Use EVT_DESTROYED instead?
  socketChannel.on(EVT_SOCKET_CHANNEL_BEFORE_DISCONNECT, () => {
    // TODO: Is there not a way to directly exit the ptyProcess?
    const { _pid: ptyProcessPid } = ptyProcess;
    process.kill(ptyProcessPid, "SIGHUP");
  });

  // console.log('socketChannelId', socketChannelId);

  // ptyProcess.write('ls\r');
  // ptyProcess.resize(100, 40);
  // ptyProcess.write('ls\r');

  // return new Date();
}
