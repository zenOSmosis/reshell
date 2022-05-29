import { useCallback, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import ReactJson from "react-json-view";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";

export const REGISTRATION_ID = "app-registration-viewer";

const AppRegistrationViewerApp = {
  id: REGISTRATION_ID,
  title: "App Registration Viewer",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    const { appRegistrations } = useAppOrchestrationContext();

    const [registration, setRegistration] = useState(null);

    const handleSetRegistration = useCallback(
      registrationId => {
        const matchedRegistration = appRegistrations.find(
          predicate => predicate.getID() === registrationId
        );

        if (matchedRegistration) {
          setRegistration(matchedRegistration.getAppDescriptor());
        } else {
          setRegistration(null);
        }
      },
      [appRegistrations]
    );

    if (!registration) {
      return (
        <Center>
          <AppRegistrationSelector
            onRegistrationChange={handleSetRegistration}
          />
        </Center>
      );
    }

    return (
      <Layout>
        <Content>
          <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <ReactJson
              src={registration}
              theme="monokai"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </Content>
        <Footer>
          <AppRegistrationSelector
            onRegistrationChange={handleSetRegistration}
          />
        </Footer>
      </Layout>
    );
  },
};

function AppRegistrationSelector({ onRegistrationChange }) {
  const { appRegistrations } = useAppOrchestrationContext();

  // TODO: Remove
  console.log({ appRegistrations });

  return (
    <div>
      <select onChange={evt => onRegistrationChange(evt.target.value)}>
        <option value="">Select app registration</option>
        {appRegistrations.map(registration => (
          <option key={registration.getUUID()} value={registration.getID()}>
            {registration.getTitle()}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AppRegistrationViewerApp;
