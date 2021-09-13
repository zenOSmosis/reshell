// TODO: Use this for documenting window API

const WindowAPIDiscovererWindow = {
  id: "window-api-discoverer",
  title: "Window API Discoverer",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: function View({ ...args }) {
    console.log("TODO: Render these args", {
      ...args,
    });

    return <div>Window API discoverer...</div>;
  },
};

export default WindowAPIDiscovererWindow;
