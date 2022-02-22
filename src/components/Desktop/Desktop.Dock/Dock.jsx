import { useCallback, useMemo, useState } from "react";
import DockItem from "./DockItem";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import useDesktopContext from "@hooks/useDesktopContext";
import useOverflowDetection from "@hooks/useOverflowDetection";

import styles from "./Dock.module.css";
import classNames from "classnames";

/**
 * Application selection Dock component.
 */
export default function Dock() {
  const [elDock, _setElDock] = useState(null);
  const [elContentWrapper, _setElContentWrapper] = useState(null);

  /**
   * @type {boolean} If true, the Dock is scrollable
   */
  const isOverflown = useOverflowDetection(elContentWrapper);

  /**
   * Handles scrolling of Dock in relation to mousewheel.
   *
   * @return {void}
   */
  const handleDockScroll = useCallback(
    evt => {
      /**
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll}
       */
      elDock.scroll({
        top: 0,
        // If horizontal orientation...
        left: elDock.scrollLeft + evt.deltaY,
        // FIXME: (jh) I can't yet tell if it's just me, or maybe my hardware,
        // but "smooth" scrolling on my laptop seems a bit quirky to get
        // started, as if the initial delta should be multiplied higher than
        // subsequent deltas
        // behavior: "smooth",
      });
    },
    [elDock]
  );

  const { activeWindowController } = useDesktopContext();
  const { appRegistrations, runningAppRegistrations, activateAppRegistration } =
    useAppOrchestrationContext();

  // TODO: Import type definition
  /** @type {AppRegistration[]} */
  const dockRegistrations = useMemo(
    () => [
      // Show unique app registrations
      ...new Set([
        ...appRegistrations.filter(registration =>
          registration.getIsPinnedToDock()
        ),
        ...runningAppRegistrations,
      ]),
    ],
    [appRegistrations, runningAppRegistrations]
  );

  // TODO: Import type definition
  /** @type {AppRegistration | void} */
  const activeRegistration = useMemo(
    () => activeWindowController?.getAppRegistration(),
    [activeWindowController]
  );

  return (
    <div
      ref={_setElDock}
      className={classNames(
        styles["dock"],
        styles["horizontal-orientation"],
        isOverflown && styles["overflown"]
      )}
      onWheel={handleDockScroll}
    >
      {
        // TODO: Add tooltip functionality
        // - https://www.npmjs.com/package/rc-tooltip
        // - https://www.npmjs.com/package/react-tooltip
        // - Note: Original Shell's Antd theme used rc-tooltip as the base (https://github.com/zenOSmosis/js-shell/blob/master/frontend/src/components/Desktop/Dock/DockItem.jsx)
        //
        // TODO: Add button menu
        // - See original Shell implementation: https://github.com/zenOSmosis/js-shell/blob/master/frontend/src/components/Desktop/Dock/DockItem.jsx
      }
      <div
        ref={_setElContentWrapper}
        className={classNames("button-group", styles["content-wrapper"])}
      >
        {
          // FIXME: (jh) Add left / right scroll buttons [in horizontal
          // orientation] when Dock overflows
          //
          // TODO: (jh) Automatically switch to another window / dock item if
          // a window is minimized or closed (should be handled via
          // AppOrchestrationService; there's a TODO there as well; search for
          // "Activating Windows")
        }
        {dockRegistrations.map(registration => (
          <DockItem
            key={registration.getUUID()}
            appRegistration={registration}
            isActiveRegistration={registration === activeRegistration}
            onClick={() => activateAppRegistration(registration)}
            elDock={elDock}
          />
        ))}
      </div>
    </div>
  );
}
