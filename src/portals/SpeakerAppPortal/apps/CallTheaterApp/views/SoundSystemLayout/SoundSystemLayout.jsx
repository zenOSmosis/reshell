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
  return <Speaker />;

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
