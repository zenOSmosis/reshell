import { REGISTRATION_ID as ABOUT_RESHELL_REGISTRATION_ID } from "./apps/AboutReShellApp";
import { REGISTRATION_ID as STARTUP_MANAGER_REGISTRATION_ID } from "./apps/StartupManagerApp";

const defaultAppAutoStartConfigs = {
  [STARTUP_MANAGER_REGISTRATION_ID]: {
    priority: 0,
  },
  [ABOUT_RESHELL_REGISTRATION_ID]: {
    priority: 5,
  },
};

export default defaultAppAutoStartConfigs;
