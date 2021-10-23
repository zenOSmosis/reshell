import Layout, { Content /* Footer */ } from "@components/Layout";
import ObjectViewer from "@components/ObjectViewer";

// TODO: Include ability to show environment of any given AppRuntime?

export const REGISTRATION_ID = "environment";

const Environment = {
  id: REGISTRATION_ID,
  title: "Environment",
  style: {
    width: 640 * 0.8,
    height: 480 * 0.8,
  },
  view: function View() {
    return (
      <Layout>
        <Content>
          <ObjectViewer src={process.env} />
        </Content>
      </Layout>
    );
  },
};

export default Environment;
