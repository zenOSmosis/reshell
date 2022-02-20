import { EVT_UPDATED } from "phantom-core";
import ReShellCore from "@core";
import { useEffect, useMemo } from "react";
import MenuBar from "@components/MenuBar";

import useDesktopContext from "@hooks/useDesktopContext";
import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import useForceUpdate from "@hooks/useForceUpdate";

// TODO: Document
export default function DesktopMenuBar() {
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

  const DESKTOP_MENU_STRUCTURE = useMemo(
    () => ({
      label: "Desktop",
      submenu: [
        {
          label: "Applications",
          submenu: appRegistrations
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
              // TODO: Include LED to show state of application (i.e. "green" for "open" / "gray" for "close")
              role: app.getTitle(),
              click: () => activateAppRegistration(app),
            })),
        },
        // Dynamically include pinned apps, if they exist
        ...(() => {
          const pinnedApps = appRegistrations
            .filter(registration => registration.getIsPinned())
            .map(app => ({
              // TODO: Include LED to show state of application (i.e. "green" for "open" / "gray" for "close")
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
        })(),
        {
          type: "separator",
          label: "Global Window Management",
        },
        {
          label: "Scatter Windows",
          click: () =>
            appRuntimes.forEach(runtime => {
              const windowController = runtime.getWindowController();

              if (windowController) {
                windowController.scatter();
              }
            }),
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
        },
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
    }),
    [appRegistrations, appRuntimes, activateAppRegistration]
  );

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
    if (activeWindowController) {
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
