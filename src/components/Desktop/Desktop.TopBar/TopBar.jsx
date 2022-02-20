import DesktopMenuBar from "./Desktop.TopBar.MenuBar";

import { Row, Column } from "@components/Layout";
import LED from "@components/LED";

// TODO: Change this to use data-driven MenuBar
import Menu, { MenuButton, MenuItem } from "@components/Menu/_Menu.LibWrapper";

import useServicesContext from "@hooks/useServicesContext";
import useAppRegistrationLink from "@hooks/useAppRegistrationLink";

import { REGISTRATION_ID as SERVICE_MONITOR_REGISTRATION_ID } from "@portals/ExamplePortal/apps/ServiceMonitorApp";

// TODO: Use prop-types
// TODO: Document
export default function TopBar() {
  // FIXME: (jh) This currently triggers a "Could not locate appRegistration
  // with id: service-monitor" warning on first render; it should be refactored
  const { link: openServiceMonitor } = useAppRegistrationLink(
    SERVICE_MONITOR_REGISTRATION_ID
  );

  const { services } = useServicesContext();

  return (
    <Row>
      <Column style={{ width: "100%" }}>
        <DesktopMenuBar />
      </Column>
      <Column
        style={{
          // TODO: Rework so column width expands according to content
          maxWidth: 110,
        }}
      >
        <div style={{ textAlign: "right" }}>
          {
            // TODO: Change this to use data-driven MenuBar
          }
          <Menu
            portal={true}
            menuButton={
              <MenuButton>
                Service Core{" "}
                <LED color={services.length > 0 ? "green" : "gray"} />
              </MenuButton>
            }
          >
            {services.length === 0 ? (
              <MenuItem>
                <span style={{ fontStyle: "italic" }}>No running services</span>
              </MenuItem>
            ) : (
              services.map(service => (
                <MenuItem
                  key={service.getUUID()}
                  // TODO: Open direct service in service monitor
                  onClick={openServiceMonitor}
                >
                  {service.getTitle()}
                </MenuItem>
              ))
            )}
          </Menu>
        </div>
      </Column>
    </Row>
  );
}
