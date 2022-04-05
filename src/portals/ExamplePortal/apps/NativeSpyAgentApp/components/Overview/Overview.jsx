import Center from "@components/Center";
import LED from "@components/LED";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import ContentButton from "@components/ContentButton";

import PowerIcon from "@icons/PowerIcon";

export default function Overview({
  registeredSpyClassNames,
  spyAgentClassNames,
  spyAgents,
}) {
  return (
    <Center canOverflow>
      {registeredSpyClassNames.map(spyClassName => {
        const isActive = spyAgentClassNames.includes(spyClassName);

        return (
          <ContentButton
            key={spyClassName}
            style={{
              border: "1px #ccc solid",
              width: 120,
              height: 120,
              display: "inline-block",
              borderRadius: 8,
              fontWeight: "bold",
              margin: 4,
            }}
          >
            <Layout style={{ padding: 4, borderRadius: 4 }}>
              <Content>
                <Layout style={{ border: "1px #ccc solid" }}>
                  <Content>
                    <Center>
                      <PowerIcon
                        style={{
                          fontSize: "1.8em",
                          color: isActive ? "green" : "gray",
                        }}
                      />
                    </Center>
                  </Content>
                  <Footer>{spyClassName}</Footer>
                </Layout>
              </Content>
              <Footer>
                <Padding>
                  <LED color={isActive ? "green" : "gray"} />
                </Padding>
              </Footer>
            </Layout>
          </ContentButton>
        );
      })}
    </Center>
  );
}
