// TODO: Move into core, named WindowManagerProvider

import { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WindowManagerRouteProvider from "./WindowManager.RouteProvider"; // WindowManagerRouteContext,
import Cover from "../Cover";
import Window from "../Window";

import useServicesContext from "@hooks/useServicesContext";
import useDesktopContext from "@hooks/useDesktopContext";
import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

import useRegistrationViewOnResized from "./hooks/useRegistrationViewOnResized";

import WindowController from "../Window/classes/WindowController";

// TODO: Incorporate react-router for window routes?

// TODO: Add hotkey listener service and map to active window

// TODO: Refactor (shared across all windows to determine relevant zIndexes)
let stackingIndex = 0;

// TODO: Document
// TODO: Use prop-types
export default function WindowManager({ appDescriptors = [], children }) {
  return (
    <WindowManagerRouteProvider>
      <WindowManagerView appDescriptors={appDescriptors}>
        {children}
      </WindowManagerView>
    </WindowManagerRouteProvider>
  );
}

function WindowManagerView({ appDescriptors = [], children }) {
  // const { locationAppRuntimes } = React.useContext(WindowManagerRouteContext);

  const { addOrUpdateAppRegistration } = useAppRegistrationsContext();
  const { appRuntimes } = useAppRuntimesContext();

  const [elBase, setElBase] = useState(null);

  // TODO: Refactor outside of window manager?
  useEffect(() => {
    appDescriptors.forEach(descriptor =>
      addOrUpdateAppRegistration(descriptor)
    );

    // TODO: Add or update these descriptors in the appropriate provider
  }, [appDescriptors, addOrUpdateAppRegistration]);

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

  // Handle setting of active window based on locationAppRuntimes
  // TODO: Fix; currently buggy w/ Safari
  // TODO: Implement deep linking
  /*
  useEffect(() => {
    const to = setTimeout(() => {
      const windowControllers = locationAppRuntimes.map((appRuntime) =>
        appRuntime.getWindowController()
      );

      if (
        !windowControllers.includes(
          refDesktopContextActiveWindowController.current
        )
      ) {
        for (const windowController of windowControllers) {
          if (windowController) {
            // Iterate through all locationAppRuntimes and set active window
            handleSetActiveWindow(windowController);
          }
        }
      }
    });

    return function unmount() {
      clearTimeout(to);
    };
  }, [locationAppRuntimes, handleSetActiveWindow]);
  */

  const { startService } = useServicesContext();

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
  const windows = appRuntimes
    .map(appRuntime => {
      // TODO: Ensure key is unique across the map
      const key = appRuntime.getUUID();

      const {
        view: ViewComponent,
        title,
        serviceClasses = [],
        isPinned,
        isPinnedToDock,
        isAutoStart,
        ...windowProps
      } = appRuntime.getAppDescriptor();

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
        const service = startService(serviceClass);

        appServices[serviceClass] = service;
      }

      return (
        <Window
          key={key}
          {...windowProps}
          elWindowManager={elBase}
          isActive={Object.is(
            desktopContextActiveWindowController,
            windowController
          )}
          onMouseDown={() => handleSetActiveWindow(windowController)}
          onTouchStart={() => handleSetActiveWindow(windowController)}
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
              appRuntime.setWindowController(windowController);

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

// TODO: Apply animations to open, close, minimize, maximize, restore, etc.
// @see https://animate.style/
// @see https://github.com/miniMAC/magic (what is "magic / puffin"?) (TODO: Create test app to try these libs?)
// # mac minimize genie effect warp
//
// TODO: Implement Svelte lifecycle methods, to avoid users having to deal with
// hooks (keep hooks as more of a low-level thing instead, if possible)
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
function WrappedView({
  appServices,
  windowController,
  appRuntime,
  view: ViewComponent,
  windowSwitchToAppRegistrationID,
  ...rest
}) {
  // TODO: Document
  const [serviceUpdateIdx, setServiceUpdateIdx] = useState(0);

  // Re-render window when a service updates
  useEffect(() => {
    const _handleServiceUpdate = () => {
      setServiceUpdateIdx(prev => prev + 1);
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
  }, [appServices]);

  // TODO: Document
  const setResizeHandler = useRegistrationViewOnResized(windowController);

  return (
    <ViewComponent
      {...rest}
      windowController={windowController}
      appServices={appServices}
      appRuntime={appRuntime}
      setResizeHandler={setResizeHandler}
      // Force update every time service updates
      serviceUpdateIdx={serviceUpdateIdx}
    />
  );
}
