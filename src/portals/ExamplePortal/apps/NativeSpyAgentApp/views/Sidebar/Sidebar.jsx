import Layout, { Content, Footer, Column } from "@components/Layout";
import Padding from "@components/Padding";
import VirtualLink from "@components/VirtualLink";
import Full from "@components/Full";
import Timer from "@components/Timer";

import ReShellCore from "@core/classes/ReShellCore";

import styles from "./Sidebar.module.css";

export default function Sidebar({
  registeredSpyClassNames,
  spyAgents,
  onSelectSpyAgent,
}) {
  return (
    <Column
      style={{
        backgroundColor: "rgba(255,255,255,.1)",
        maxWidth: 180,
      }}
      className={styles["sidebar"]}
    >
      <Layout>
        <Content>
          <Full style={{ overflowY: "auto" }}>
            <Padding>
              <h1>Class</h1>
              <div>
                <ul>
                  {registeredSpyClassNames.map(spiedOnClassName => {
                    const groupedSpyAgents = spyAgents.filter(
                      agent => agent.getSpiedOnClassName() === spiedOnClassName
                    );

                    return (
                      <li key={spiedOnClassName}>
                        <VirtualLink onClick={() => alert("TODO: Handle")}>
                          {spiedOnClassName}
                        </VirtualLink>
                        <ul>
                          {groupedSpyAgents.map(spyAgent => (
                            <li key={spyAgent.getUUID()}>
                              <button
                                style={{ width: "100%", textAlign: "left" }}
                                onClick={() => onSelectSpyAgent(spyAgent)}
                              >
                                <div className={styles["title"]}>
                                  {spyAgent.getTitle()}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <Timer onTick={spyAgent.getInstanceUptime} />
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Padding>
          </Full>
        </Content>
        <Footer>
          <Padding className="note">
            ReShell Uptime: <Timer onTick={ReShellCore.getReShellUptime} />
          </Padding>
        </Footer>
      </Layout>
    </Column>
  );
}
