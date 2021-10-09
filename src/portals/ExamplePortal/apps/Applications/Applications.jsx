import { useCallback, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Link from "@components/Link";

import ApplicationSelector from "./views/ApplicationSelector";
import PortalSwitcher from "./views/PortalSelector";
import { useEffect } from "react/cjs/react.development";

// TODO: Implement application search

const DEFAULT_SEARCH_QUERY = "";

const Applications = {
  id: "applications",
  title: "Applications",
  style: {
    width: 640,
    height: 400,
  },
  isAutoStart: true,
  isPinnedToDock: true,
  initialSharedState: {
    searchQuery: DEFAULT_SEARCH_QUERY,
  },
  titleBarView: function TitleBarView({ sharedState, setSharedState }) {
    const handleSetSearchQuery = useCallback(
      evt => setSharedState({ searchQuery: evt.target.value }),
      [setSharedState]
    );

    const handleDoubleClick = useCallback(
      evt => {
        // Prevent double-clicks from resizing the window if there is text in
        // the search bar
        if (Boolean(sharedState.searchQuery)) {
          evt.stopPropagation();
        }
      },
      [sharedState]
    );

    return (
      <Padding>
        {
          // TODO: Automatically focus when window is activated (unless on mobile)
        }
        <input
          placeholder="Search Applications"
          onChange={handleSetSearchQuery}
          value={sharedState.searchQuery}
          style={{ width: "100%" }}
          onDoubleClick={handleDoubleClick}
        />
      </Padding>
    );
  },
  view: function View({ windowController, sharedState, setSharedState }) {
    const [isDisplayingPortals, setIsDisplayingPortals] = useState(false);

    // Auto-switch window title depending on "Applications" or "Portals" mode
    useEffect(() => {
      windowController.setTitle(
        !isDisplayingPortals ? "Applications" : "Portals"
      );
    }, [windowController, isDisplayingPortals]);

    const searchQuery = sharedState?.searchQuery;

    const handleResetSearchQuery = useCallback(
      () => setSharedState({ searchQuery: DEFAULT_SEARCH_QUERY }),
      [setSharedState]
    );

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
