// import { useEffect } from "react";
import Layout, { Header, Content } from "@components/Layout";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_APP_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevicesApp";

// import InputMediaDevicesService from "@services/InputMediaDevicesService";

// TODO: Implement functionality from previous debug app

const MSTCDebugApp = {
  id: "mstc-debug",
  title: "MSTC Debug",
  style: {
    width: 640,
    height: 480,
  },
  // serviceClasses: [InputMediaDevicesService],
  view: function View(
    {
      /* appServices */
    }
  ) {
    // const inputMediaDevicesService = appServices[InputMediaDevicesService];

    // const captureFactories = inputMediaDevicesService.getCaptureFactories();

    // TODO: Remove
    // console.log({ captureFactories });

    return (
      <Layout>
        <Header>
          <AppLinkButton id={INPUT_MEDIA_DEVICES_APP_REGISTRATION_ID} />
        </Header>
        <Content>..</Content>
      </Layout>
    );
  },
};

export default MSTCDebugApp;
