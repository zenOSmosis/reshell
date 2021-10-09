// import Padding from "@components/Padding";
// import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

// TODO: Use this for prototyping environment passing
const MediaStreamStats = {
  id: "media-stream-stats",
  title: "Media Stream Stats",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return <Center>[MediaStreamStats]</Center>;
  },
};

export default MediaStreamStats;
