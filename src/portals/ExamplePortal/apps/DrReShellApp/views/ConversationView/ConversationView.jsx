import { useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import CRT from "@components/CRT";

export default function ConversationView() {
  const [value, setValue] = useState("Hello");

  return (
    <CRT style={{ backgroundColor: "rgba(255,255,255,.9)" }}>
      <Layout>
        <Content>
          <Padding>
            <textarea
              className="unstyled"
              style={{
                color: "green",
                fontWeight: "bold",
                width: "100%",
                height: "100%",
              }}
              value={value}
              onChange={evt => setValue(evt.target.value)}
            ></textarea>
          </Padding>
        </Content>
      </Layout>
    </CRT>
  );
}
