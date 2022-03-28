import ReShellCore from "@core";

import { useCallback, useEffect, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import VirtualLink from "@components/VirtualLink";

import useKeyboardEvents from "@hooks/useKeyboardEvents";

import ApplicationSelector from "./views/ApplicationSelector";
import PortalSwitcher from "./views/PortalSelector";

const LEN_PORTALS = Object.keys(ReShellCore.getPortals()).length;

const DEFAULT_SEARCH_QUERY = "";

export const REGISTRATION_ID = "applications";

const ApplicationsApp = {
  id: REGISTRATION_ID,
  title: "Applications",
  style: {
    width: 640 * 1.2,
    height: 400 * 1.2,
  },
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
    const [elSearch, setElSearch] = useState(null);

    // Clear search query on escape
    useKeyboardEvents(elSearch, {
      onEscape: () => setSharedState({ searchQuery: "" }),
    });

    const handleSetSearchQuery = useCallback(
      evt => setSharedState({ searchQuery: evt.target.value }),
      [setSharedState]
    );

    const handleDoubleClick = useCallback(
      evt => {
        // Prevent double-clicks from propagating if there is text
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
          //
          // TODO: Switch to Applications view on change
          //
          // FIXME: (jh) I tried to use type="search", which gives you an X in
          // the input field, however I wasn't able to make it clear itself. If
          // this were an uncontrolled component, it might work. Needs some
          // refactoring.
          //
          // FIXME: Create common TextInput component which has double-click
          // functionality baked in; use in TextInputModal as well, etc. It
          // shouldn't get fancy and it should be compatible with regular DOM-
          // based text input props
        }
        <input
          ref={setElSearch}
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
        // TODO: Use default values instead of hardcoded
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

export default ApplicationsApp;
