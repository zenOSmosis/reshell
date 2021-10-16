import ReShellCore from "@core";

import { useCallback, useEffect, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import VirtualLink from "@components/VirtualLink";

import ApplicationSelector from "./views/ApplicationSelector";
import PortalSwitcher from "./views/PortalSelector";

const LEN_PORTALS = Object.keys(ReShellCore.getPortals()).length;

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
  // TODO: Implement the ability to set control handlers which can be driven by the menu
  /*
  controlMethods: {
    // [ROLE_WINDOW_MENU_SUBITEM]
    setIsDisplayingPortals: ({...samePropsAsView, etc.}) => {
    }
  },
  */
  // TODO: Implement custom menu functionality
  /**
  menu: {
    window: [
      {
        role: 'view-switch'
        getIsShown: ({sharedState}) => !sharedState.isShowingApplications
        title: 'Show Applications',
        onClick: ({controlMethods}) => ...
      },
      {
        role: 'view-switch'
        getIsShown: ({sharedState}) => sharedState.isShowingApplications
        title: 'Show Portals',
        onClick: ({controlMethods}) => ...
      },
  ]
  }
  */
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
          // TODO: Switch to Applications view on change
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
        {Boolean(LEN_PORTALS > 1) && (
          <Footer>
            <Padding>
              <button onClick={() => setIsDisplayingPortals(prev => !prev)}>
                {!isDisplayingPortals ? "Portals" : "Applications"}
              </button>{" "}
              <span className="note">
                {!isDisplayingPortals ? (
                  <>
                    Other applications may be available in{" "}
                    <VirtualLink onClick={() => setIsDisplayingPortals(true)}>
                      another portal
                    </VirtualLink>
                    .
                  </>
                ) : (
                  <>
                    Return to{" "}
                    <VirtualLink onClick={() => setIsDisplayingPortals(false)}>
                      application list
                    </VirtualLink>
                    .
                  </>
                )}
              </span>
            </Padding>
          </Footer>
        )}
      </Layout>
    );
  },
};

export default Applications;
