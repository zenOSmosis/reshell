import { getClassName } from "phantom-core";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout, { Content, Row, Column } from "@components/Layout";
import SidebarColumn from "./views/Sidebar";
import MainContent from "./views/MainContent";

import NativeSpyService from "@services/NativeSpyService";

export const REGISTRATION_ID = "native-spy-agent";

const NativeSpyAgentApp = {
  id: "native-spy-agent",
  title: "Native Spy Agent",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [NativeSpyService],
  view: function View({ appServices }) {
    const nativeSpyService = appServices[NativeSpyService];

    const registeredSpies = nativeSpyService.getRegisteredSpies();

    const registeredSpyClassNames = useMemo(
      () => registeredSpies.map(spiedOn => getClassName(spiedOn)),
      [registeredSpies]
    );

    const spyAgents = nativeSpyService.getSpyAgents();

    const spyAgentClassNames = useMemo(
      () => spyAgents.map(agent => agent.getSpiedOnClassName()),
      [spyAgents]
    );

    const [selectedSpyAgent, setSelectedSpyAgent] = useState(null);

    const onSpyAgentDeselect = useCallback(() => setSelectedSpyAgent(null), []);

    // Reset selected spy agent if it doesn't exist
    useEffect(() => {
      if (selectedSpyAgent && !spyAgents.includes(selectedSpyAgent)) {
        setSelectedSpyAgent(null);
      }
    }, [spyAgents, selectedSpyAgent]);

    return (
      <Layout>
        <Content>
          <Row>
            <SidebarColumn
              registeredSpyClassNames={registeredSpyClassNames}
              spyAgentClassNames={spyAgentClassNames}
              spyAgents={spyAgents}
              onSelectSpyAgent={setSelectedSpyAgent}
            />
            <Column>
              <MainContent
                registeredSpyClassNames={registeredSpyClassNames}
                spyAgentClassNames={spyAgentClassNames}
                spyAgents={spyAgents}
                selectedSpyAgent={selectedSpyAgent}
                onSpyAgentDeselect={onSpyAgentDeselect}
              />
            </Column>
          </Row>
        </Content>
      </Layout>
    );
  },
};

export default NativeSpyAgentApp;
