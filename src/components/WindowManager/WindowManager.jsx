import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cover from "../Cover";
import Window from "../Window";
import { EVT_DESTROYED } from "phantom-core";

import useDesktopContext from "../../hooks/useDesktopContext";

import WindowController from "../Window/classes/WindowController";

// TODO: Refactor
let stackingIndex = 0;

// TODO: Document
export default function WindowManager({ initialWindows = [] }) {
  const [elBase, setElBase] = useState(null);

  const {
    activeWindowController: desktopContextActiveWindowController,
    setActiveWindowController: setDesktopContextActiveWindowController,
  } = useDesktopContext();

  /**
   * @type {number[] | string[]} keys
   */
  const [discardedWindowIds, setDiscardedWindowIds] = useState([]);

  // TODO: Document
  const [windowControllerMaps, setWindowControllerMaps] = useState({});

  /**
   * @param {number | string } key
   * @return {Object | void}
   */
  const getWindowControllerMapWithKey = useCallback(
    (key) => {
      const map = windowControllerMaps[key];

      return map;
    },
    [windowControllerMaps]
  );

  // TODO: Document
  const getWindowControllerWithKey = useCallback(
    (key) => {
      const map = getWindowControllerMapWithKey(key);

      if (map) {
        return map.windowController;
      }
    },
    [getWindowControllerMapWithKey]
  );

  // TODO: Document
  const getWindowControllerMapWithWindowController = useCallback(
    (windowController) => {
      return Object.values(windowControllerMaps).find((predicate) =>
        Object.is(predicate.windowController, windowController)
      );
    },
    [windowControllerMaps]
  );

  // TODO: Document
  const [activeWindowKey, _setActiveWindowKey] = useState(null);

  /**
   * @param {number | string | null} key?
   * @return {void}
   */
  const handleSetActiveWindow = useCallback(
    (key) => {
      _setActiveWindowKey(key);

      if (key === undefined || key === null) {
        setDesktopContextActiveWindowController(null);
      } else {
        // TODO: Don't bring to front if already in front

        const map = getWindowControllerMapWithKey(key);

        if (map) {
          const { windowController } = map;

          if (
            !Object.is(windowController, desktopContextActiveWindowController)
          ) {
            setDesktopContextActiveWindowController(windowController);

            windowController.setState({ stackingIndex: ++stackingIndex });
          }
        }
      }
    },
    [
      desktopContextActiveWindowController,
      setDesktopContextActiveWindowController,
      getWindowControllerMapWithKey,
      _setActiveWindowKey,
    ]
  );

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

  // Set active window when desktopContextActiveWindowController changes
  useEffect(() => {
    if (desktopContextActiveWindowController) {
      const map = getWindowControllerMapWithWindowController(
        desktopContextActiveWindowController
      );

      if (map) {
        const { key } = map;

        handleSetActiveWindow(key);
      } else {
        // Write back to desktop context that we cannot set this
        setDesktopContextActiveWindowController(null);
      }
    }
  }, [
    desktopContextActiveWindowController,
    getWindowControllerMapWithWindowController,
    handleSetActiveWindow,
    setDesktopContextActiveWindowController,
  ]);

  /**
   * @param {number | string } key
   * @return {void}
   */
  const handleWindowMinimize = useCallback(
    (key) => {
      const map = getWindowControllerMapWithKey(key);

      if (map) {
        const { windowController } = map;

        windowController.setState({ isMinimized: true });
      }
    },
    [getWindowControllerMapWithKey]
  );

  /**
   * @param {number | string } key
   * @return {void}
   */
  const handleWindowClose = useCallback(
    (key) => {
      const map = getWindowControllerMapWithKey(key);

      if (map) {
        const { windowController } = map;

        // TODO: Determine here if window is in a non-saved state, and if the
        // user should be prompted before closing

        windowController.destroy();
      }
    },
    [getWindowControllerMapWithKey]
  );

  /**
   * Handles converting initial window data into a renderable component with
   * associated window controller, per instance.
   *
   * @type {React.Component[]}
   */
  const windows = useMemo(() => {
    return initialWindows
      .map((data) => {
        // TODO: Ensure key is unique across the map
        const key = data.id;

        // Don't try to create a new window controller if the key is already
        // set
        if (discardedWindowIds.includes(key)) {
          return null;
        }

        const { view: View, title, ...windowProps } = data;

        if (!View) {
          return null;
        }

        /** @type {WindowController | void} */
        const windowController = getWindowControllerWithKey(key);

        // ... If we're not a new window
        if (windowController) {
          // Enable received data to update window controller title
          const prevTitle = windowController.getTitle();
          if (prevTitle !== title) {
            windowController.setTitle(title);
          }
        }

        return (
          <Window
            key={key}
            {...windowProps}
            isActive={activeWindowKey === key}
            onMouseDown={() => handleSetActiveWindow(key)}
            onTouchStart={() => handleSetActiveWindow(key)}
            onRequestMinimize={() => handleWindowMinimize(key)}
            onRequestClose={() => handleWindowClose(key)}
            ref={(ref) => {
              if (ref && !windowController) {
                const windowController = new WindowController();

                ref.setWindowController(windowController);

                setWindowControllerMaps((prev) => {
                  const next = { ...prev };
                  next[key] = {
                    windowController,
                    key,
                    el: ref.el,
                    windowSymbol: ref.windowSymbol,
                  };

                  return next;
                });

                windowController.once(EVT_DESTROYED, () => {
                  setWindowControllerMaps((prev) => {
                    const next = { ...prev };

                    delete next[key];

                    return next;
                  });

                  // Prevent re-creating this window if the inbound window data
                  // array still retains the id
                  setDiscardedWindowIds((prev) => [...prev, key]);
                });
              }
            }}
          >
            <View />
          </Window>
        );
      })
      .filter((window) => Boolean(window));
  }, [
    initialWindows,
    getWindowControllerWithKey,
    discardedWindowIds,
    handleSetActiveWindow,
    handleWindowClose,
    handleWindowMinimize,
    activeWindowKey,
  ]);

  // TODO: Remove
  console.log({ windows, windowControllerMaps });

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
