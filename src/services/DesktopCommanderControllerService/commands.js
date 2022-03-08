// import beep from "@utils/beep";

import { REGISTRATION_ID as APPLICATIONS_REGISTRATION_ID } from "@portals/ExamplePortal/apps/ApplicationsApp";

import {
  DESKTOP_PARADIGM,
  MOBILE_PARADIGM,
  AUTO_DETECT_PARADIGM,
} from "@services/UIParadigmService";

const REPOSITION_OFFSET = 300;

// TODO: Make this more generic so that it can open any application by calling
// it by name
export const CMD_OPEN_APPLICATIONS = {
  id: "open-applications",
  keywords: "open applications",
  description: "Open Applications app",
  action: (commander, { appOrchestrationService }) => {
    appOrchestrationService.activateAppRegistrationWithID(
      APPLICATIONS_REGISTRATION_ID
    );
  },
};

// FIXME: (jh) Safari doesn't like this and can throw an Unhandled Rejection
// (NotAllowedError) if the user doesn't activate some sort of system sounds
// prior to this command running. A workaround could be to try / catch and
// present a UIModal asking the user if they wish to start sounds, should an
// error be thrown. If accepted, a sound would be generated to start the
// browser's sound engine.
/*
export const CMD_ACTIVATE_NEXT_WINDOW = {
  id: "beep",
  keywords: "beep system sound chime beeping tone",
  description: "Generates a beep tone",
  example: "Beep"
  action: (commander, params = {}) => beep(),
};
*/

export const CMD_ACTIVATE_NEXT_WINDOW = {
  id: "activate-next-window",
  keywords: "cycle activate next window",
  description: "Activate next window",
  action: (commander, { windowController, appOrchestrationService }) => {
    const windowControllers = appOrchestrationService.getWindowControllers();
    const idxCurrent = windowControllers.indexOf(windowController);

    const nextWindowController =
      windowControllers[idxCurrent + 1] || windowControllers[0];

    if (nextWindowController) {
      nextWindowController.bringToTop();
    }
  },
};

export const CMD_ACTIVATE_PREVIOUS_WINDOW = {
  id: "activate-previous-window",
  keywords: "cycle activate previous window",
  description: "Activate previous window",
  action: (commander, { windowController, appOrchestrationService }) => {
    const windowControllers = appOrchestrationService.getWindowControllers();
    const idxCurrent = windowControllers.indexOf(windowController);

    const prevWindowController =
      windowControllers[idxCurrent - 1] ||
      windowControllers[windowControllers.length - 1];

    if (prevWindowController) {
      prevWindowController.bringToTop();
    }
  },
};

export const CMD_MOVE_WINDOW_UP = {
  id: "move-window-up",
  keywords: "reposition move window up",
  description: "Move a window up",
  action: (commander, { windowController }) => {
    if (windowController) {
      const prevPosition = windowController.getPosition();

      windowController.setPosition({
        x: prevPosition.x,
        y: prevPosition.y - REPOSITION_OFFSET,
      });
    }
  },
};

export const CMD_MOVE_WINDOW_UP_AND_RIGHT = {
  id: "move-window-up-and-right",
  keywords: "reposition move window up and right",
  description: "Move a window up and right",
  action: (commander, { windowController }) => {
    if (windowController) {
      const prevPosition = windowController.getPosition();

      windowController.setPosition({
        x: prevPosition.x + REPOSITION_OFFSET,
        y: prevPosition.y - REPOSITION_OFFSET,
      });
    }
  },
};

export const CMD_MOVE_WINDOW_UP_AND_LEFT = {
  id: "move-window-up-and-left",
  keywords: "reposition move window up and left",
  description: "Move a window up and left",
  action: (commander, { windowController }) => {
    if (windowController) {
      const prevPosition = windowController.getPosition();

      windowController.setPosition({
        x: prevPosition.x - REPOSITION_OFFSET,
        y: prevPosition.y - REPOSITION_OFFSET,
      });
    }
  },
};

export const CMD_MOVE_WINDOW_RIGHT = {
  id: "move-window-right",
  keywords: "reposition move window right",
  description: "Move a window right",
  action: (commander, { windowController }) => {
    if (windowController) {
      const prevPosition = windowController.getPosition();

      windowController.setPosition({
        x: prevPosition.x + REPOSITION_OFFSET,
        y: prevPosition.y,
      });
    }
  },
};

export const CMD_MOVE_WINDOW_DOWN = {
  id: "move-window-down",
  keywords: "reposition move window down",
  description: "Move a window down",
  action: (commander, { windowController }) => {
    const prevPosition = windowController.getPosition();

    windowController.setPosition({
      x: prevPosition.x,
      y: prevPosition.y + REPOSITION_OFFSET,
    });
  },
};

export const CMD_MOVE_WINDOW_DOWN_AND_RIGHT = {
  id: "move-window-down-and-right",
  keywords: "reposition move window down and right",
  description: "Move a window down and right",
  action: (commander, { windowController }) => {
    if (windowController) {
      const prevPosition = windowController.getPosition();

      windowController.setPosition({
        x: prevPosition.x + REPOSITION_OFFSET,
        y: prevPosition.y + REPOSITION_OFFSET,
      });
    }
  },
};

export const CMD_MOVE_WINDOW_DOWN_AND_LEFT = {
  id: "move-window-down-and-left",
  keywords: "reposition move window down and left",
  description: "Move a window down and left",
  action: (commander, { windowController }) => {
    const prevPosition = windowController.getPosition();

    windowController.setPosition({
      x: prevPosition.x - REPOSITION_OFFSET,
      y: prevPosition.y + REPOSITION_OFFSET,
    });
  },
};

export const CMD_MOVE_WINDOW_LEFT = {
  id: "move-window-left",
  keywords: "reposition move window left",
  description: "Move a window left",
  action: (commander, { windowController }) => {
    if (windowController) {
      const prevPosition = windowController.getPosition();

      windowController.setPosition({
        x: prevPosition.x - REPOSITION_OFFSET,
        y: prevPosition.y,
      });
    }
  },
};

export const CMD_CENTER_WINDOW = {
  id: "center-window",
  keywords: "reposition center window",
  description: "Center a window",
  action: (commander, { windowController }) => {
    if (windowController) {
      windowController.center();
    }
  },
};

export const CMD_CENTER_ALL_WINDOWS = {
  id: "center-all-windows",
  keywords: "reposition center all windows",
  description: "Center all windows",
  action: (commander, { appOrchestrationService }) => {
    appOrchestrationService
      .getWindowControllers()
      .forEach(windowController => windowController.center());
  },
};

export const CMD_SCATTER_WINDOW = {
  id: "scatter-window",
  keywords: "reposition scatter window",
  description: "Scatter a window",
  action: (commander, { windowController }) => {
    if (windowController) {
      windowController.scatter();
    }
  },
};

export const CMD_SCATTER_ALL_WINDOWS = {
  id: "scatter-all-windows",
  keywords: "reposition scatter all windows",
  description: "Scatter all windows",
  action: (commander, { appOrchestrationService }) => {
    appOrchestrationService
      .getWindowControllers()
      .forEach(controller => controller.scatter());
  },
};

export const CMD_MAXIMIZE_WINDOW = {
  id: "maximize-window",
  keywords: "resize maximize window",
  description: "Maximize a window",
  action: (commander, { windowController }) => {
    if (windowController) {
      windowController.maximize();
    }
  },
};

export const CMD_MINIMIZE_WINDOW = {
  id: "minimize-window",
  keywords: "resize minimize window",
  description: "Minimize a window",
  action: (commander, { windowController }) => {
    if (windowController) {
      windowController.minimize();
    }
  },
};

export const CMD_RESTORE_WINDOW = {
  id: "restore-window",
  keywords: "resize restore window",
  description: "Restore a window",
  action: (commander, { windowController }) => {
    if (windowController) {
      windowController.restore();
    }
  },
};

// TODO: Handle
/*
export const OPEN_APPLICATION = {
  id: "open-application",
  keywords: "open application window",
  description: "TODO: Make description",
  action: (commander, params = {}) => null,
};
*/

export const CLOSE_APPLICATION = {
  id: "close-application",
  keywords: "close application window",
  description: "Close an application window",
  action: async (commander, { windowController }) => {
    if (windowController) {
      await windowController.destroy();
    }
  },
};

// TODO: Handle
/*
export const FOCUS_TEXT_FIELD = {
  id: "focus-text-field",
  keywords: "focus input cursor text field",
  description: "Focus an input field",
  action: (commander, params = {}) => null,
};
*/

// TODO: Handle
/*
export const TYPE_IN_TEXT_FIELD = {
  id: "type-in-text-field",
  keywords: "input cursor type text field",
  description: "Type in an input field",
  action: (commander, params = {}) => null,
};
*/

export const SWITCH_TO_DESKTOP_PARADIGM = {
  id: "desktop-paradigm",
  keywords: "switch select desktop paradigm view display",
  description: "Switch to desktop UI paradigm",
  action: async (commander, { uiParadigmService }) => {
    uiParadigmService.setStaticUIParadigm(DESKTOP_PARADIGM);
  },
};

export const SWITCH_TO_MOBILE_PARADIGM = {
  id: "mobile-paradigm",
  keywords: "switch select mobile paradigm view display",
  description: "Switch to mobile UI paradigm",
  action: async (commander, { uiParadigmService }) => {
    uiParadigmService.setStaticUIParadigm(MOBILE_PARADIGM);
  },
};

export const SWITCH_TO_AUTO_DETECT_PARADIGM = {
  id: "auto-detect-paradigm",
  keywords: "switch select auto detect paradigm view display",
  description: "Switch to auto detect UI paradigm",
  action: async (commander, { uiParadigmService }) => {
    uiParadigmService.setStaticUIParadigm(AUTO_DETECT_PARADIGM);
  },
};
