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
            disabled
            key={spyClassName}
            style={{
              border: "1px #999 solid",
              borderRadius: 8,
              width: 120,
              height: 120,
              display: "inline-block",
              fontWeight: "bold",
              margin: 4,
            }}
          >
            <Layout style={{ padding: 4, borderRadius: 4 }}>
              <Content>
                <Layout
                  style={{
                    border: "1px #999 solid",
                    borderRadius: 4,
                    backgroundColor: "rgba(255, 255, 255, .05)",
                  }}
                >
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
