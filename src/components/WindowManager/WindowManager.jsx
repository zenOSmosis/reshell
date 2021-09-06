// TODO: Move into core, named WindowManagerProvider

import { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Cover from "../Cover";
import Window from "../Window";

import useServicesContext from "@hooks/useServicesContext";
import useDesktopContext from "@hooks/useDesktopContext";
import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

import WindowController from "../Window/classes/WindowController";

// TODO: Incorporate react-router for window routes?

// TODO: Refactor (shared across all windows to determine relevant zIndexes)
let stackingIndex = 0;

// TODO: Document
// TODO: Use prop-types
export default function WindowManager({ appDescriptors = [] }) {
  const { addOrUpdateAppRegistration } = useAppRegistrationsContext();
  const { appRuntimes } = useAppRuntimesContext();

  const [elBase, setElBase] = useState(null);

  // TODO: Refactor outside of window manager?
  useEffect(() => {
    appDescriptors.forEach((descriptor) =>
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
    (key) => {
      const map = windowControllerMaps[key];

      return map;
    },
    [windowControllerMaps]
  );

  /**
   * @param {WindowController | null} windowController?
   * @return {void}
   */
  const handleSetActiveWindow = useCallback(
    (windowController) => {
      if (!Object.is(windowController, desktopContextActiveWindowController)) {
        setDesktopContextActiveWindowController(windowController);

        if (windowController) {
          // TODO: Don't bring to front if already in front (i.e. is already the active window)
          windowController.setState({ stackingIndex: ++stackingIndex });
        }
      }
    },
    [
      desktopContextActiveWindowController,
      setDesktopContextActiveWindowController,
    ]
  );

  const { startService } = useServicesContext();

  // Handle when window manager is clicked on directly (no window interacted with directly)
  const refHandleSetActiveWindow = useRef(handleSetActiveWindow);
  refHandleSetActiveWindow.current = handleSetActiveWindow;
  useEffect(() => {
    if (elBase) {
      const _handleElBaseTouch = (evt) => {
        // Deselect active window if desktop base is touched
        if (evt.target === elBase) {
          refHandleSetActiveWindow.current(null);
        }
      };

      elBase.addEventListener("mousedown", _handleElBaseTouch);
      elBase.addEventListener("touchstart", _handleElBaseTouch);

      return function unmount() {
        elBase.removeEventListener("mousedown", _handleElBaseTouch);
        elBase.removeEventListener("touchstart", _handleElBaseTouch);
      };
    }
  }, [elBase]);

  /**
   * @param {WindowController} windowController
   * @return {void}
   */
  const handleWindowMinimize = useCallback((windowController) => {
    if (windowController) {
      windowController.minimize();
    }
  }, []);

  /**
   * @param {WindowController} windowController
   * @return {void}
   */
  const handleWindowClose = useCallback(
    (windowController) => {
      if (windowController) {
        // TODO: Determine here if window is in a non-saved state, and if the
        // user should be prompted before closing

        windowController.destroy();

        // Make no window the active window
        // TODO: Make previous window the active window?
        handleSetActiveWindow(null);
      }
    },
    [handleSetActiveWindow]
  );

  /**
   * Determines which windows are rendered to the screen at any given time, as
   * \well as controls instantiation and association of window controllers with
   * their respective views.
   *
   * @type {React.Component[]}
   */
  // TODO: Can this be memoized again even w/ hooks running in window descriptors?
  // TODO: Don't render off of the descriptors, but off of active AppRegistration instances
  const windows = appRuntimes
    .map((appRuntime) => {
      // TODO: Ensure key is unique across the map
      const key = appRuntime.getUUID();

      const {
        view: ViewComponent,
        title,
        serviceClasses = [],
        isPinned,
        ...windowProps
      } = appRuntime.getAppDescriptor();

      if (!ViewComponent) {
        return null;
      }

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
      const windowServices = {};
      for (const serviceClass of serviceClasses) {
        const service = startService(serviceClass);

        windowServices[serviceClass] = service;
      }

      return (
        <Window
          key={key}
          {...windowProps}
          isActive={Object.is(
            desktopContextActiveWindowController,
            windowController
          )}
          onMouseDown={() => handleSetActiveWindow(windowController)}
          onTouchStart={() => handleSetActiveWindow(windowController)}
          onRequestMinimize={() => handleWindowMinimize(windowController)}
          onRequestClose={() => handleWindowClose(windowController)}
          ref={(ref) => {
            if (ref && !windowController) {
              // Begin process of attaching window controller to rendered view
              // and setting up event bindings

              // TODO: Attach to window monitor, once available
              const windowController = new WindowController();

              windowController.setTitle(title);

              // Link app runtime to window controller (so that when the window
              // controller is destructed it will take down the app runtime)
              windowController.setAppRuntime(appRuntime);

              // Attach the view controller to the window
              ref.attachWindowController(windowController);

              setWindowControllerMaps((prev) => {
                const next = { ...prev };
                next[key] = {
                  windowController,
                  key,
                  // windowSymbol: ref.windowSymbol,
                };

                return next;
              });

              windowController.once(EVT_DESTROYED, () => {
                setWindowControllerMaps((prev) => {
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
              windowServices={windowServices}
              windowController={windowController}
              appRuntime={appRuntime}
              view={ViewComponent}
            />
          )}
        </Window>
      );
    })
    .filter((window) => Boolean(window));

  return (
    <Cover>
      {
        // TODO: Bind touch event to this element, and if directly touching it,
        // make currently active window not active (if cursor is in another
        // window, ensure it is removed as well)
        //
        // setActiveWindowController(null)
      }
      <div ref={setElBase} style={{ width: "100%", height: "100%" }}>
        {windows}
      </div>
    </Cover>
  );
}

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
// TODO: Document
function WrappedView({
  windowServices,
  windowController,
  appRuntime,
  view: ViewComponent,
  ...rest
}) {
  const [serviceUpdateIdx, setServiceUpdateIdx] = useState(0);

  // Re-render window when a service updates
  useEffect(() => {
    const _handleServiceUpdate = () => {
      setServiceUpdateIdx((prev) => prev + 1);
    };

    for (const service of Object.values(windowServices)) {
      service.on(EVT_UPDATED, _handleServiceUpdate);
    }

    return function unmount() {
      for (const service of Object.values(windowServices)) {
        service.off(EVT_UPDATED, _handleServiceUpdate);
      }
    };
  }, [windowServices]);

  return (
    <ViewComponent
      {...rest}
      windowController={windowController}
      windowServices={windowServices}
      appRuntime={appRuntime}
      // Force update every time service updates
      serviceUpdateIdx={serviceUpdateIdx}
    />
  );
}
