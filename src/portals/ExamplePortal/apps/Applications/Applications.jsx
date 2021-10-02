import { useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";

import ApplicationSelector from "./views/ApplicationSelector";
import PortalSwitcher from "./views/PortalSelector";

const Applications = {
  id: "applications",
  title: "Applications",
  style: {
    width: 640,
    height: 400,
  },
  isPinnedToDock: true,
  view: function View() {
    const [isDisplayingPortals, setIsDisplayingPortals] = useState(false);

    return (
      <Layout>
        <Content>
          {!isDisplayingPortals ? <ApplicationSelector /> : <PortalSwitcher />}
        </Content>
        <Footer>
          <Padding>
            <button onClick={() => setIsDisplayingPortals(prev => !prev)}>
              {!isDisplayingPortals ? "Portals" : "Applications"}
            </button>{" "}
            <span className="note">
              Other applications may be available in another portal
            </span>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default Applications;
