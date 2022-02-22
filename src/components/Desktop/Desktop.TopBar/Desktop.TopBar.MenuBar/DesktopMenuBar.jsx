import { EVT_UPDATED } from "phantom-core";
import ReShellCore from "@core";
import { useEffect, useMemo } from "react";
import MenuBar from "@components/MenuBar";

import useDesktopContext from "@hooks/useDesktopContext";
import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import useForceUpdate from "@hooks/useForceUpdate";
import useUIParadigm, {
  DESKTOP_PARADIGM,
  MOBILE_PARADIGM,
} from "@hooks/useUIParadigm";

// TODO: Document
export default function DesktopMenuBar() {
  const { uiParadigm, isUIParadigmAutoSet, setStaticUIParadigm } =
    useUIParadigm();

  const { activeWindowController } = useDesktopContext();
  const { appRegistrations, activateAppRegistration, appRuntimes } =
    useAppOrchestrationContext();

  const forceUpdate = useForceUpdate();

  // Force update menus when active window controller updates (i.e. when
  // changed, minimized, maximized, etc.)
  useEffect(() => {
    if (activeWindowController) {
      activeWindowController.on(EVT_UPDATED, forceUpdate);

      return () => {
        activeWindowController.off(EVT_UPDATED, forceUpdate);
      };
    }
  }, [activeWindowController, forceUpdate]);

  const applicationsMenuData = useMemo(
    () =>
      appRegistrations
        // Sort registrations alphabetically
        .sort((a, b) => {
          const aTitle = a.getTitle();
          const bTitle = b.getTitle();

          if (aTitle < bTitle) {
            return -1;
          } else if (bTitle > aTitle) {
            return 1;
          } else {
            return 0;
          }
        })
        .map(app => ({
          // FIXME: (jh) Include checkboxes next to active registrations
          role: app.getTitle(),
          click: () => activateAppRegistration(app),
        })),
    [appRegistrations, activateAppRegistration]
  );

  const pinnedAppsMenuData = useMemo(() => {
    const pinnedApps = appRegistrations
      .filter(registration => registration.getIsPinned())
      .map(app => ({
        // FIXME: (jh) Include checkboxes next to active pinned registrations?
        role: app.getTitle(),
        click: () => activateAppRegistration(app),
      }));

    if (pinnedApps.length) {
      return [
        {
          type: "separator",
          label: "Pinned Applications",
        },
        ...pinnedApps,
      ];
    } else {
      return [];
    }
  }, [appRegistrations, activateAppRegistration]);

  const hasOpenedWindows = appRuntimes.length > 0;

  const DESKTOP_MENU_STRUCTURE = {
    label: "Desktop",
    submenu: [
      {
        label: "Applications",
        submenu: applicationsMenuData,
      },
      // Dynamically include pinned apps and their corresponding separator, if
      // exists
      ...pinnedAppsMenuData,
      {
        type: "separator",
        label: "Layout Control",
      },
      {
        label: "UI Paradigm",
        submenu: [
          {
            label: "Desktop Paradigm",
            click: () => setStaticUIParadigm(DESKTOP_PARADIGM),
            type: "checkbox",
            checked: uiParadigm === DESKTOP_PARADIGM,
          },
          {
            label: "Mobile Paradigm",
            click: () => setStaticUIParadigm(MOBILE_PARADIGM),
            type: "checkbox",
            checked: uiParadigm === MOBILE_PARADIGM,
          },
          {
            label: "Auto Detect",
            click: () => setStaticUIParadigm(null),
            type: "checkbox",
            checked: isUIParadigmAutoSet,
          },
        ],
      },
      ...(() => {
        if (uiParadigm === DESKTOP_PARADIGM) {
          return [
            {
              label: "Scatter Windows",
              click: () =>
                appRuntimes.forEach(runtime => {
                  const windowController = runtime.getWindowController();

                  if (windowController) {
                    windowController.scatter();
                  }
                }),
              disabled: !hasOpenedWindows,
            },
            {
              label: "Center Windows",
              click: () =>
                appRuntimes.forEach(runtime => {
                  const windowController = runtime.getWindowController();

                  if (windowController) {
                    windowController.center();
                  }
                }),
              disabled: !hasOpenedWindows,
            },
          ];
        } else {
          return [];
        }
      })(),
      {
        type: "separator",
        label: "Desktop Operations",
      },
      {
        label: "Reload ReShell",
        click: () => {
          window.confirm("Are you sure you wish to reload?") &&
            ReShellCore.reload();
        },
      },
      {
        label: "Quit ReShell",
        click: () => {
          window.confirm("Are you sure you wish to close the desktop?") &&
            ReShellCore.destroy();
        },
      },
    ],
  };

  const activeWindowTitle = activeWindowController?.getTitle();

  const ACTIVE_APP_MENU_STRUCTURE = useMemo(() => {
    if (activeWindowController) {
      return {
        label: activeWindowTitle,
        submenu: [
          {
            // TODO: Use role instead
            label: "Quit",
            click: () => activeWindowController.destroy(),
          },
        ],
      };
    }
  }, [activeWindowController, activeWindowTitle]);

  const ACTIVE_WINDOW_MENU_STRUCTURE = (() => {
    if (uiParadigm === DESKTOP_PARADIGM && activeWindowController) {
      return {
        label: "Window",
        submenu: [
          {
            label: "Minimize",
            click: () => activeWindowController.minimize(),
            disabled: activeWindowController.getIsMinimized(),
          },
          {
            label: "Maximize",
            click: () => activeWindowController.maximize(),
            disabled: activeWindowController.getIsMaximized(),
          },
          {
            label: "Restore",
            click: () => activeWindowController.restore(),
            disabled:
              !activeWindowController.getIsMaximized() &&
              !activeWindowController.getIsMinimized(),
          },
          {
            label: "Scatter",
            click: () => activeWindowController.scatter(),
          },
          {
            label: "Center",
            click: () => activeWindowController.center(),
          },
        ],
      };
    }
  })();

  return (
    <MenuBar
      menuStructures={[
        DESKTOP_MENU_STRUCTURE,
        ACTIVE_APP_MENU_STRUCTURE,
        ACTIVE_WINDOW_MENU_STRUCTURE,
      ]}
    />
  );
}
