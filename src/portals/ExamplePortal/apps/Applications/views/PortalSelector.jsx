import Center from "@components/Center";

import ReShellCore from "@core";

export default function PortalSwitcher() {
  return (
    <Center canOverflow={true}>
      {Object.entries(ReShellCore.getPortals()).map(([portalName]) => (
        <button key={portalName} onClick={() => ReShellCore.init(portalName)}>
          {portalName}
        </button>
      ))}
    </Center>
  );
}
