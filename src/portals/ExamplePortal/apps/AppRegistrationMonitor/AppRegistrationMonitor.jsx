import { useCallback, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import ReactJson from "react-json-view";

import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";

// TODO: Finish building out

const AppRegistrationMonitor = {
  id: "app-registration-monitor",
  title: "App Registration Monitor",
  style: {
    left: "auto",
    top: 0,
    width: 640,
    height: 480,
  },
  view: function View() {
    const { appRegistrations } = useAppRegistrationsContext();

    const [registration, setRegistration] = useState(null);

    const handleSetRegistration = useCallback(
      (registrationId) => {
        const matchedRegistration = appRegistrations.find(
          (predicate) => predicate.getID() === registrationId
        );

        console.log({
          matchedRegistration,
        });

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
  const { appRegistrations } = useAppRegistrationsContext();

  // TODO: Remove
  console.log({ appRegistrations });

  return (
    <div>
      <select onChange={(evt) => onRegistrationChange(evt.target.value)}>
        <option value="">Select app registration</option>
        {appRegistrations.map((registration) => (
          <option key={registration.getUUID()} value={registration.getID()}>
            {registration.getTitle()}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AppRegistrationMonitor;
