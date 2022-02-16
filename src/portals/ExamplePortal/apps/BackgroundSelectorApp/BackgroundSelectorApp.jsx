import Center from "@components/Center";

// TODO: Include ability to use video streams captured by media-stream-track-controller as the background (show as thumbnails)
// TODO: Use default Desktop backgroundView as a thumbnail
// TODO: Use zenOSmosis logo as a background option

// TODO: Use particles as potential background
// TODO: Use solid colors as potential background
// TODO: Allow user-defined URL as potential background

export const REGISTRATION_ID = "background-selector";

const BackgroundSelectorApp = {
  id: REGISTRATION_ID,
  title: "Background Selector",
  style: {
    width: 640,
    height: 300,
  },
  // serviceClasses: [InputMediaDevicesService],
  view: function View({ appServices }) {
    return <Center>TODO: Background Selector</Center>;
  },
};

export default BackgroundSelectorApp;
