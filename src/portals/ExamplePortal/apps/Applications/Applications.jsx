import { useCallback, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Link from "@components/Link";

import ApplicationSelector from "./views/ApplicationSelector";
import PortalSwitcher from "./views/PortalSelector";
import { useEffect } from "react/cjs/react.development";

// TODO: Implement application search

const Applications = {
  id: "applications",
  title: "Applications",
  style: {
    width: 640,
    height: 400,
  },
  isAutoStart: true,
  isPinnedToDock: true,
  titleBarView: function TitleBarView() {
    return (
      <input
        placeholder="Search Applications"
        // onChange={evt => setSearchQuery(evt.target.value)}
        // value={searchQuery}
      />
    );
  },
  view: function View({ windowController }) {
    const [isDisplayingPortals, setIsDisplayingPortals] = useState(false);

    // Auto-switch window title depending on "Applications" or "Portals" mode
    useEffect(() => {
      windowController.setTitle(
        !isDisplayingPortals ? "Applications" : "Portals"
      );
    }, [windowController, isDisplayingPortals]);

    const [searchQuery, setSearchQuery] = useState("");

    const handleResetSearchQuery = useCallback(() => setSearchQuery(""), []);

    return (
      <Layout>
        <Content>
          {!isDisplayingPortals ? (
            <ApplicationSelector
              searchQuery={searchQuery}
              onResetSearchQuery={handleResetSearchQuery}
            />
          ) : (
            <PortalSwitcher />
          )}
        </Content>
        <Footer>
          <Padding>
            <button onClick={() => setIsDisplayingPortals(prev => !prev)}>
              {!isDisplayingPortals ? "Portals" : "Applications"}
            </button>{" "}
            <span className="note">
              {!isDisplayingPortals ? (
                <>
                  Other applications may be available in{" "}
                  <Link onClick={() => setIsDisplayingPortals(true)}>
                    another portal
                  </Link>
                  .
                </>
              ) : (
                <>
                  Return to{" "}
                  <Link onClick={() => setIsDisplayingPortals(false)}>
                    application list
                  </Link>
                  .
                </>
              )}
            </span>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default Applications;
