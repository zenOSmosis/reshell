import Layout, { Header, Content } from "@components/Layout";
import Menubar from "@components/Menubar";
import Center from "@components/Center";

const ApplicationMonitor = {
  // TODO: Do we still need "id" if using path? (use path + title concatenation for id)
  id: "menubar-Prototype",
  // path: "/Applications/Utilities/Prototypes" // TODO: Sync path w/ OpenFS?
  title: "Menubar Prototype",
  menu: {
    // TODO: Prototype this
  },
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: function View({ appRuntime }) {
    // TODO: Handle dynamic setting of menubar

    const menuData = createTestMenuStructure(appRuntime, true);

    return (
      // TODO: Add proto menubar here and populate it w/ test structure
      <Layout>
        <Header>
          <Menubar menuData={menuData} />
        </Header>
        <Content>
          <Center>
            <button
              onClick={() =>
                console.log(createTestMenuStructure(appRuntime, true))
              }
            >
              log(createTestMenuStructure())
            </button>
          </Center>
        </Content>
      </Layout>
    );
  },
};

export default ApplicationMonitor;

function createTestMenuStructure(appRuntime, isMac = false) {
  //
  const app = {
    name: appRuntime.getTitle(),
  };

  // NOTE: This template is copied exactly from
  // https://www.electronjs.org/docs/api/menu#examples and the goal is to
  // make it update our menubar the same way (they did all the hard work of
  // figuring this stuff out, so might as well just take what they have and
  // make it work with ReShell)
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",

          // TODO: Allow onClick alias as well in our runtime version?
          click: async () => {
            alert("click");

            // TODO: Hmm... electron exposes a shell object, look into other API similarities
            // const { shell } = require("electron");
            // await shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];

  return template;
}
