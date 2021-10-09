import { useState } from "react";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Center from "@components/Center";
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
  view: function View({ windowController }) {
    const [isDisplayingPortals, setIsDisplayingPortals] = useState(false);

    // Auto-switch window title depending on "Applications" or "Portals" mode
    useEffect(() => {
      windowController.setTitle(
        !isDisplayingPortals ? "Applications" : "Portals"
      );
    }, [windowController, isDisplayingPortals]);

    const [searchQuery, setSearchQuery] = useState(null);

    return (
      <Layout>
        <Header>
          {!isDisplayingPortals && (
            <Padding>
              <Center>
                <input
                  placeholder="Search Applications"
                  onChange={evt => setSearchQuery(evt.target.value)}
                  defaultValue={searchQuery}
                />
              </Center>
            </Padding>
          )}
        </Header>
        <Content>
          {!isDisplayingPortals ? (
            <ApplicationSelector searchQuery={searchQuery} />
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
