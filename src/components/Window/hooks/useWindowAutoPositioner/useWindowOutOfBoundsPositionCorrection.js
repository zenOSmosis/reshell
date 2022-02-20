import { useEffect, useCallback } from "react";
import debounce from "debounce";

import { EVT_RESIZED, EVT_MOVED } from "../../classes/WindowController";

import getElSize from "@utils/getElSize";
import getElPosition from "@utils/getElPosition";

import useObjectState from "@hooks/useObjectState";

import {
  WINDOW_POSITION_OOB_TOP_THRESHOLD,
  WINDOW_POSITION_OOB_BOTTOM_THRESHOLD,
  WINDOW_POSITION_OOB_LEFT_THRESHOLD,
  WINDOW_POSITION_OOB_RIGHT_THRESHOLD,
} from "../__window_hook_constants__";

/**
 * Dynamically detects if the given window is out-of-bounds and calculates
 * the corrected position to bring it back within the acceptable boundary.
 *
 * This actively monitors the window for moving and resizing, as well as the
 * window manager for resizing.
 *
 * @typedef { import('../../classesWindowController').default} WindowController
 *
 * @param {{elWindow: HTMLElement, elWindowManager: HTMLElement, windowController: WindowController}} options
 * @return {{x: number | null, y: number | null}}
 */
export default function useWindowOutOfBoundsPositionCorrection({
  elWindow,
  elWindowManager,
  windowController,
}) {
  const [correctionPosition, _setCorrectionPosition] = useObjectState({
    x: null,
    y: null,
  });

  /**
   * @param {{elWindow: HTMLElement, elWindowManager: HTMLElement}}
   * @return {{x: number | null, y: number | null}}
   */
  const getOutOfBoundsPositionCorrection = useCallback(
    (elWindow, elWindowManager) => {
      // const winManCenter = getElCenterPoint(elWindowManager);
      const winManSize = getElSize(elWindowManager);
      const winSize = getElSize(elWindow);
      const winPosition = getElPosition(elWindow);

      const winTL = {
        x: winPosition.x,
        y: winPosition.y,
      };

      const winTR = {
        x: winPosition.x + winSize.width,
        y: winPosition.y,
      };

      const correctedPosition = {
        x: null,
        y: null,
      };

      // If top-right position of window is less than left threshold
      if (winTR.x < WINDOW_POSITION_OOB_LEFT_THRESHOLD) {
        correctedPosition.x =
          WINDOW_POSITION_OOB_LEFT_THRESHOLD - winSize.width;
      }

      // If top position of window is less than top threshold
      if (winTR.y < WINDOW_POSITION_OOB_TOP_THRESHOLD) {
        correctedPosition.y = WINDOW_POSITION_OOB_TOP_THRESHOLD;
      }

      // If top-left position of window is less than window manager width minus
      // right threshold
      if (winTL.x > winManSize.width - WINDOW_POSITION_OOB_RIGHT_THRESHOLD) {
        correctedPosition.x =
          winManSize.width - WINDOW_POSITION_OOB_RIGHT_THRESHOLD;
      }

      // If top position of window is less than window manager height minus
      // bottom threshold
      if (winTL.y > winManSize.height - WINDOW_POSITION_OOB_BOTTOM_THRESHOLD) {
        correctedPosition.y =
          winManSize.height - WINDOW_POSITION_OOB_BOTTOM_THRESHOLD;
      }

      return correctedPosition;
    },
    []
  );

  // Bind event listeners
  useEffect(() => {
    if (elWindow && elWindowManager && windowController) {
      // Invoked when window is resized or removed, or if the viewport is
      // resized
      const _handleResizeOrMove = debounce(
        () => {
          // Fixes issue where previously minimized windows might be out of
          // position once restored
          // Relevant issue: https://github.com/jzombie/pre-re-shell/issues/131
          if (windowController.getIsMinimized()) {
            return;
          }

          const nextCorrectionPosition = getOutOfBoundsPositionCorrection(
            elWindow,
            elWindowManager
          );

          // NOTE: This relies on useObjectState's equality checking to not re
          // render if nothing has changed
          _setCorrectionPosition(nextCorrectionPosition);
        },

        100,
        // Run on trailing edge
        false
      );

      windowController.on(EVT_RESIZED, _handleResizeOrMove);
      windowController.on(EVT_MOVED, _handleResizeOrMove);

      // TODO: Use common handler instead
      window.addEventListener("resize", _handleResizeOrMove);

      // Perform initial check
      _handleResizeOrMove();

      return function unmount() {
        windowController.off(EVT_RESIZED, _handleResizeOrMove);
        windowController.off(EVT_MOVED, _handleResizeOrMove);

        window.removeEventListener("resize", _handleResizeOrMove);
      };
    }
  }, [
    elWindow,
    elWindowManager,
    windowController,
    getOutOfBoundsPositionCorrection,
    _setCorrectionPosition,
  ]);

  return correctionPosition;
}
