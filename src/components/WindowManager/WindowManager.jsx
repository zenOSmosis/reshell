import React, { useCallback, useEffect, useRef, useState } from "react";
import Cover from "../Cover";
import Window from "../Window";
import { EVT_DESTROYED } from "phantom-core";

import useServicesContext from "../../hooks/useServicesContext";
import useDesktopContext from "../../hooks/useDesktopContext";

import WindowController from "../Window/classes/WindowController";

// TODO: Incorporate react-router for window routes?

// TODO: Refactor
let stackingIndex = 0;

// TODO: Document
export default function WindowManager({ initialWindows = [] }) {
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
  const handleWindowClose = useCallback((windowController) => {
    if (windowController) {
      // TODO: Determine here if window is in a non-saved state, and if the
      // user should be prompted before closing

      windowController.destroy();
    }
  }, []);

  /**
   * Determines which windows are rendered to the screen at any given time, as
   * \well as controls instantiation and association of window controllers with
   * their respective views.
   *
   * @type {React.Component[]}
   */
  // TODO: Can this be memoized again even w/ hooks running in window descriptors?
  const windows = initialWindows
    .map((data) => {
      // TODO: Ensure key is unique across the map
      const key = data.id;

      const {
        view: ViewComponent,
        title,
        serviceClasses = [],
        ...windowProps
      } = data;

      if (!ViewComponent) {
        return null;
      }

      // TODO: (mostly for development), determine changed descriptor window
      // title and update the window controller w/ new values

      const dataMap = getWindowControllerMapWithKey(key);

      /** @type {WindowController | void} */
      const windowController = dataMap && dataMap.windowController;

      // If we previously had a window controller running with this id
      //
      // TODO: Implement ability to flush this and restart a window with the same id?
      if (dataMap && !dataMap.windowController) {
        return null;
      }

      // Duplicate service class instantiations are ignored, so this is fine
      // on every render
      for (const serviceClass of serviceClasses) {
        startService(serviceClass);
      }

      return (
        <React.Fragment key={key}>
          <Window
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
                const windowController = new WindowController();

                windowController.setTitle(title);

                ref.setWindowController(windowController);

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
              }
            }}
          >
            <ViewComponent windowController={windowController} />
          </Window>
        </React.Fragment>
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
