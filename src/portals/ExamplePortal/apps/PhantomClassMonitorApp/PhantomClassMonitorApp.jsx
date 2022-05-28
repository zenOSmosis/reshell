import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";

import PhantomClassMonitorService from "@services/PhantomClassMonitorService";

export const REGISTRATION_ID = "phantom-class-monitor";

const PhantomClassMonitorApp = {
  id: REGISTRATION_ID,
  title: "Phantom Class Monitor",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [PhantomClassMonitorService],
  view: function View({ appServices }) {
    const phantomMonitor = appServices[PhantomClassMonitorService];

    // TODO: Remove
    console.log({ phantomClassNames: phantomMonitor.getPhantomClassNames() });

    return <div>Hello</div>;
  },
};

export default PhantomClassMonitorApp;
