import Layout, { Content /* Footer */ } from "@components/Layout";
import ReactJson from "react-json-view";

// TODO: Include ability to show environment of any given AppRuntime?

const Environment = {
  id: "environment",
  title: "Environment",
  style: {
    left: "auto",
    bottom: 0,
    width: 640 * 0.8,
    height: 480 * 0.8,
  },
  view: function View() {
    return (
      <Layout>
        <Content>
          <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <ReactJson
              src={process.env}
              theme="monokai"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </Content>
      </Layout>
    );
  },
};

export default Environment;
