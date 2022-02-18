import { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WindowManagerRouteProvider from "./WindowManager.RouteProvider"; // WindowManagerRouteContext,
import Cover from "../Cover";
import Window from "../Window";

import WindowProvider from "../Window/Window.Provider";
import useWindowContext from "../Window/hooks/useWindowContext";

import useServicesContext from "@hooks/useServicesContext";
import useDesktopContext from "@hooks/useDesktopContext";
import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import useForceUpdate from "@hooks/useForceUpdate";

import useRegistrationViewOnResized from "./hooks/useRegistrationViewOnResized";

import WindowController from "../Window/classes/WindowController";

// TODO: Add hotkey listener service and map to active window

// TODO: Refactor (shared across all windows to determine relevant zIndexes)
let stackingIndex = 0;

// TODO: Document
// TODO: Use prop-types
export default function WindowManager({ appDescriptors = [], children }) {
  const { addOrUpdateAppRegistration } = useAppOrchestrationContext();

  // TODO: Refactor outside of window manager?
  useEffect(() => {
    appDescriptors.forEach(descriptor =>
      addOrUpdateAppRegistration(descriptor)
    );

    // TODO: Add or update these descriptors in the appropriate provider
  }, [appDescriptors, addOrUpdateAppRegistration]);

  return (
    <WindowManagerRouteProvider>
      <WindowManagerView>{children}</WindowManagerView>
    </WindowManagerRouteProvider>
  );
}

function WindowManagerView({ children }) {
  const { appRuntimes } = useAppOrchestrationContext();

  const [elBase, setElBase] = useState(null);

  const {
    activeWindowController: desktopContextActiveWindowController,
    setActiveWindowController: setDesktopContextActiveWindowController,
  } = useDesktopContext();

  // TODO: Document
  const [windowControllerMaps, setWindowControllerMaps] = useState({});

  /**
   * @param {number | string } key
   * @return {Object | void} // TODO: Document structure
   */
  const getWindowControllerMapWithKey = useCallback(
    key => {
      const map = windowControllerMaps[key];

      return map;
    },
    [windowControllerMaps]
  );

  // IMPORTANT: Prevents infinite loop of handleSetActiveWindow when used as dependency
  const refDesktopContextActiveWindowController = useRef(null);
  refDesktopContextActiveWindowController.current =
    desktopContextActiveWindowController;

  /**
   * @param {WindowController | null} windowController?
   * @return {void}
   */
  const handleSetActiveWindow = useCallback(
    windowController => {
      // Restore minimized windows
      // IMPORTANT: This should come before the is-current-window determination
      // so that the Dock (and other activators) can un-minimize, regardless of
      // the active window
      if (windowController?.getIsMinimized()) {
        windowController.setIsMinimized(false);
      }

      if (
        !Object.is(
          windowController,
          refDesktopContextActiveWindowController.current
        )
      ) {
        setDesktopContextActiveWindowController(windowController);

        if (windowController) {
          // TODO: Don't bring to front if already in front (i.e. is already the active window)
          windowController.setState({ stackingIndex: ++stackingIndex });
        }
      }
    },
    [setDesktopContextActiveWindowController]
  );

  /**
   * Retrieves whether or not the given window controller is attached to the
   * active window.
   *
   * @return {boolean}
   */
  const handleGetIsActiveWindow = useCallback(
    windowController =>
      Object.is(desktopContextActiveWindowController, windowController),
    [desktopContextActiveWindowController]
  );

  const { startServiceClass } = useServicesContext();

  // Handle when window manager is clicked on directly (no window interacted with directly)
  const refHandleSetActiveWindow = useRef(handleSetActiveWindow);
  refHandleSetActiveWindow.current = handleSetActiveWindow;
  useEffect(() => {
    if (elBase) {
      const _handleElBaseTouch = evt => {
        // Deselect active window if desktop base is touched
        if (evt.target === elBase) {
          refHandleSetActiveWindow.current(null);
        }
      };

      elBase.addEventListener("mousedown", _handleElBaseTouch);
      elBase.addEventListener("touchstart", _handleElBaseTouch, {
        // @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
        passive: true,
      });

      return function unmount() {
        elBase.removeEventListener("mousedown", _handleElBaseTouch);
        elBase.removeEventListener("touchstart", _handleElBaseTouch, {
          // FIXME: (jh) I'm not positive if this should be on the
          // removeEventListener (I think not, but erroring on the side of
          // caution)
          // @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
          // @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
          passive: true,
        });
      };
    }
  }, [elBase]);

  /**
   * Determines which windows are rendered to the screen at any given time, as
   * \well as controls instantiation and association of window controllers with
   * their respective views.
   *
   * @type {React.Component[]}
   */
  // TODO: Can this be memoized again even w/ hooks running in window
  // descriptors?
  // TODO: Fix issue where every window will re-render when another window
  // actively goes on top (not sure if it's a huge deal, but is seemingly
  // unnecessary)
  //
  // TODO: Somehow figure out support for reparenting if needing to change
  // window manager layouts: https://github.com/facebook/react/issues/3965
  // (maybe this? https://www.npmjs.com/package/react-reverse-portal)
  const windows = appRuntimes
    .map(appRuntime => {
      const appDescriptor = appRuntime.getAppDescriptor();
      if (!appDescriptor) {
        return null;
      }

      // TODO: Ensure key is unique across the map
      const key = appRuntime.getUUID();

      // NOTE: The variables absorbed by this decompositor (except for
      // windowProps) are NOT passed down to the underlying DOM element of the
      // window
      //
      // FIXME: (jh) Perhaps this logic should be refactored and most props not
      // utilized on every single render (maybe the complete wrapped window
      // could be a separate component instead of re-calcuating all of this
      // stuff on every render)
      const {
        view: ViewComponent,
        titleBarView,
        initialSharedState,

        // This one is tricky, don't pass up registration ID as DOM element ID
        id,

        title,
        serviceClasses = [],
        isPinned,
        isPinnedToDock,
        isAutoStart,
        ...windowProps
      } = appDescriptor;

      if (!ViewComponent) {
        return null;
      }

      // TODO: Re-active previously focused element when bringing new window to
      // top

      // TODO: (mostly for development), determine changed descriptor window
      // title and update the window controller w/ new values

      // TODO: Document
      const dataMap = getWindowControllerMapWithKey(key);

      /** @type {WindowController | void} */
      const windowController = dataMap && dataMap.windowController;

      // TODO: Fix issues with rendering errors related to the usage of this
      /*
      if (windowController) {
        windowController.__INTERNAL__setIsActive(
          handleGetIsActiveWindow(windowController)
        );
      }
      */

      // If we previously had a window controller running with this id
      //
      // TODO: Implement ability to flush this and restart a window with the same id?
      if (dataMap && !dataMap.windowController) {
        return null;
      }

      // TODO: Memoize this handling
      // TODO: Attach services to window controller so other UI utilities can
      // reference what is specific to this window
      // TODO: Rename to appServices?
      const appServices = {};
      for (const serviceClass of serviceClasses) {
        const service = startServiceClass(serviceClass);

        appServices[serviceClass] = service;
      }

      // TODO: Memoize this component, when refactoring outer map
      return (
        <WindowProvider key={key} initialSharedState={initialSharedState}>
          <Window
            {...windowProps}
            elWindowManager={elBase}
            // TODO: Remove isActive and pass in from WindowController to the window
            isActive={handleGetIsActiveWindow(windowController)}
            onMouseDown={() => handleSetActiveWindow(windowController)}
            onTouchStart={() => handleSetActiveWindow(windowController)}
            titleBarView={
              titleBarView ? (
                <WrappedTitleBarView
                  titleBarView={titleBarView}
                  appServices={appServices}
                  windowController={windowController}
                  appRuntime={appRuntime}
                />
              ) : null
            }
            ref={ref => {
              if (ref && !windowController) {
                // Begin process of attaching window controller to rendered view
                // and setting up event bindings

                const windowController = new WindowController(
                  {},
                  {
                    onBringToTop: handleSetActiveWindow,
                  }
                );

                windowController.setTitle(title);

                windowController.attachWindowManagerElement(elBase);

                // Link app runtime to window controller (so that when the window
                // controller is destructed it will take down the app runtime)
                windowController.setAppRuntime(appRuntime);
                appRuntime.__INTERNAL__setWindowController(windowController);

                // Attach the view controller to the window
                ref.attachWindowController(windowController);

                setWindowControllerMaps(prev => {
                  const next = { ...prev };
                  next[key] = {
                    windowController,
                    key,
                    // windowSymbol: ref.windowSymbol,
                  };

                  return next;
                });

                windowController.once(EVT_DESTROYED, () => {
                  setWindowControllerMaps(prev => {
                    const next = { ...prev };

                    next[key].windowController = null;

                    return next;
                  });
                });

                // Set this new window as the active window
                handleSetActiveWindow(windowController);
              }
            }}
          >
            {
              // Wrap the view so that it updates when a bound service updates
              // NOTE: (jh) I originally tried wrapping the window itself, but
              // it didn't work, and it's a better idea to only update what's
              // necessary anyway
            }
            {windowController && (
              <WrappedView
                appServices={appServices}
                windowController={windowController}
                appRuntime={appRuntime}
                view={ViewComponent}
              />
            )}
          </Window>
        </WindowProvider>
      );
    })
    .filter(window => Boolean(window));

  return (
    <Cover>
      {
        // TODO: Bind touch event to this element, and if directly touching it,
        // make currently active window not active (if cursor is in another
        // window, ensure it is removed as well)
        //
        // setActiveWindowController(null)
      }
      <div
        ref={setElBase}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        {children}

        {windows}
      </div>
    </Cover>
  );
}

// TODO: Document
const WrappedTitleBarView = function ({ titleBarView, ...rest }) {
  return <WrappedView {...rest} view={titleBarView} />;
};

// FIXME: (jh) [As a consideration] Implement Svelte lifecycle methods, to
// avoid users having to deal with hooks (keep hooks as more of a low-level
// thing instead, if possible)
// - https://svelte.dev/tutorial/onmount
// - https://svelte.dev/tutorial/ondestroy
// - https://svelte.dev/tutorial/update
// - https://svelte.dev/tutorial/tick
// Maybe we can say, "we built a rendering engine on top of React, so that
// React components can be used, without the complexity of dealing with React
// hook dependencies, in order to reduce excessive rendering, or stale states,
// caused by improper user of hook dependencies".... could also smooth the
// transition over to Svelte or any other rendering engine for apps created on
// top of one of them.
//
// TODO: Document; rename? (NOTE: this wrapped view was designed to make it
// easier to make the wrapping view render out-of-sequence with the containing
// view, such as when a service updates, etc.)
const WrappedView = function WrappedView({
  appServices,
  windowController,
  appRuntime,
  view: ViewComponent,
}) {
  const forceUpdate = useForceUpdate();

  const { sharedState, setSharedState } = useWindowContext();

  // Re-render window when a service updates
  useEffect(() => {
    const _handleServiceUpdate = () => {
      forceUpdate();
    };

    for (const service of Object.values(appServices)) {
      // TODO: Make this channel-specific (i.e. EVT_MAIN_STATE_UPDATED)?
      service.on(EVT_UPDATED, _handleServiceUpdate);
    }

    return function unmount() {
      for (const service of Object.values(appServices)) {
        // TODO: Make this channel-specific (i.e. EVT_MAIN_STATE_UPDATED)?
        service.off(EVT_UPDATED, _handleServiceUpdate);
      }
    };
  }, [appServices, forceUpdate]);

  // TODO: Document
  const setResizeHandler = useRegistrationViewOnResized(windowController);

  return (
    <ViewComponent
      windowController={windowController}
      appServices={appServices}
      appRuntime={appRuntime}
      setResizeHandler={setResizeHandler}
      sharedState={sharedState}
      setSharedState={setSharedState}
    />
  );
};
