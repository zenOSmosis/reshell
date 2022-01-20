import ApplicationsApp from "../../ExamplePortal/apps/ApplicationsApp";

const ApplicationsOverrideApp = {
  ...ApplicationsApp,
  isAutoStart: false,
};

export default ApplicationsOverrideApp;
