import Center from "@components/Center";
import SocketIOService from "@services/SocketIOService";

// TODO: Look into https://rclone.org for server-side mount-points with
// third-party storage providers

// TODO: Save As view: https://developer.apple.com/design/human-interface-guidelines/macos/buttons/disclosure-controls/
// TODO: Save As API structure: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/PromptforaFileName.html#//apple_ref/doc/uid/TP40016239-CH82-SW1

// TODO: See reference project (these links are for an Electon-based file explorer written w/ TypeScript)
// - [dev.to] https://dev.to/kimlimjustin/i-wrote-a-fully-functioning-file-explorer-using-typescript-1e4n
// - [github] https://github.com/kimlimjustin/xplorer
// - [gitpod] https://gitpod.io/#/https://github.com/kimlimjustin/xplorer

const Files = {
  id: "files",
  title: "Files",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [SocketIOService],
  view: function View({ windowController, appServices }) {
    const socketService = appServices[SocketIOService];

    // TODO: Build out
    return (
      <Center>
        {" "}
        <button
          onClick={() => {
            socketService.createSocketChannel().then(socketChannel => {
              socketChannel.write("TESTING 1 2 3");
            });
          }}
        >
          Emit test hello
        </button>
      </Center>
    );
  },
};

export default Files;
