import Center from "@components/Center";

import ReShellCore from "@core";

export default function PortalSwitcher() {
  return (
    <Center canOverflow={true}>
      {Object.entries(ReShellCore.getPortals()).map(([portalName]) => (
        <button
          key={portalName}
          onClick={() =>
            // TODO: Use dialog modal for this, and dynamically set the title based on the current portal state
            window.confirm(
              "Any unsaved state will be lost and the current call will be dropped if switching portals.  Proceed?"
            ) && ReShellCore.switchToPortal(portalName)
          }
        >
          {portalName}
        </button>
      ))}
    </Center>
  );
}
