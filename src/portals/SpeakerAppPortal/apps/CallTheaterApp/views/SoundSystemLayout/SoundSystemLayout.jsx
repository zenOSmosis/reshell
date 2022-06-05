// import { useEffect } from "react";
import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
import Center from "@components/Center";
import Image from "@components/Image";

import Speaker from "@components/Speaker";

import ZenOSmosisLogo from "@assets/zenOSmosis-Logo-2046x530@72.png";

export default function SoundSystemLayout() {
  return (
    <Row>
      <Column>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "100%",
            maxWidth: "100%",
            padding: 20,
          }}
        >
          <div style={{ height: 40 }}></div>
          <Speaker />
          <div style={{ height: 40 }}></div>
          <Speaker />
          <div style={{ height: 40 }}></div>
          <Speaker />
          <div style={{ height: 40 }}></div>
        </div>
      </Column>
      <Column>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "100%",
            maxWidth: "100%",
            padding: 20,
          }}
        >
          <div style={{ height: 40 }}></div>
          <Speaker />
          <div style={{ height: 40 }}></div>
          <Speaker />
          <div style={{ height: 40 }}></div>
          <Speaker />
          <div style={{ height: 40 }}></div>
        </div>
      </Column>
    </Row>
  );

  return (
    <Layout>
      <Content>
        <Row>
          <Column
            style={{ maxWidth: "25%", border: "1px #ccc solid" }}
          ></Column>
          <Column>
            <Layout>
              <Content></Content>
              <Footer style={{ maxHeight: 100, textAlign: "center" }}>
                <Image src={ZenOSmosisLogo} />
              </Footer>
            </Layout>
          </Column>
          <Column
            style={{ maxWidth: "25%", border: "1px #ccc solid" }}
          ></Column>
        </Row>
      </Content>
    </Layout>
  );
}
