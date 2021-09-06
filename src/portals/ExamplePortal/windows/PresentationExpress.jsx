import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Center from "@components/Center";

const PresentationExpress = {
  id: "express-point",
  title: "Presentation Express",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View() {
    return (
      <Layout>
        <Row>
          <Column
            style={{
              maxWidth: 150,
              backgroundColor: "rgba(255, 255,255,.4)",
              textAlign: "center",
            }}
          >
            <div>
              {["slide 1", "slide 2", "slide 3"].map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "90%",
                    height: 80,
                    border: "1px black solid",
                    backgroundColor: "rgba(0,0,0,.4)",
                    display: "inline-block",
                    margin: "10px auto",
                  }}
                >
                  <Center>{slide}</Center>
                </div>
              ))}
            </div>
          </Column>
          <Column>
            <Layout>
              <Content>
                <Center>[content]</Center>
              </Content>
              <Footer style={{ textAlign: "right" }}>
                <button>Prev</button>
                <button>Next</button>
              </Footer>
            </Layout>
          </Column>
        </Row>
      </Layout>
    );
  },
};

export default PresentationExpress;
