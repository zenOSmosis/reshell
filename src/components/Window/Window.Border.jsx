import Layout, { Header, Content, Footer, Row, Column } from "../Layout";
import { useDrag } from "react-use-gesture";

// TODO: Height and width are synonymous

// TODO: Resizable element for touch displays: https://csslayout.io/patterns/resizable-element

export const DIR_BORDER_NW = "NW";
export const DIR_BORDER_N = "N";
export const DIR_BORDER_NE = "NE";
export const DIR_BORDER_E = "E";
export const DIR_BORDER_SE = "SE";
export const DIR_BORDER_S = "S";
export const DIR_BORDER_SW = "SW";
export const DIR_BORDER_W = "W";

// TODO: Use prop-types
// TODO: Document
export default function WindowBorder({
  children,
  onBorderDrag,
  borderWidth = 3,
  isDisabled = false,
  ...rest
}) {
  // @see https://use-gesture.netlify.app/docs/#simple-example
  const bindNW = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_NW, { mx, my, isDragging });
  });

  const bindN = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_N, { mx, my, isDragging });
  });

  const bindNE = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_NE, { mx, my, isDragging });
  });

  const bindE = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_E, { mx, my, isDragging });
  });

  const bindSE = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_SE, { mx, my, isDragging });
  });

  const bindS = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_S, { mx, my, isDragging });
  });

  const bindSW = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_SW, { mx, my, isDragging });
  });

  const bindW = useDrag(({ down: isDragging, movement: [mx, my] }) => {
    onBorderDrag(DIR_BORDER_W, { mx, my, isDragging });
  });

  if (isDisabled) {
    return children;
  }

  return (
    // TODO: Enable merge-able styles / classNames
    <Layout {...rest}>
      <Header>
        <Row style={{ maxHeight: borderWidth, height: borderWidth }}>
          <Column
            {...bindNW()}
            style={{ maxWidth: borderWidth, cursor: "nw-resize" }}
          ></Column>
          <Column {...bindN()} style={{ cursor: "n-resize" }}></Column>
          <Column
            {...bindNE()}
            style={{ maxWidth: borderWidth, cursor: "ne-resize" }}
          ></Column>
        </Row>
      </Header>
      <Content>
        <Row>
          <Column
            {...bindW()}
            style={{ maxWidth: borderWidth, cursor: "w-resize" }}
          ></Column>
          <Column>
            {
              // TODO: Use layout to wrap the child in a frame, w/ diagonal positions included
            }
            {children}
          </Column>
          <Column
            {...bindE()}
            style={{ maxWidth: borderWidth, cursor: "e-resize" }}
          ></Column>
        </Row>
      </Content>
      <Footer>
        <Row style={{ maxHeight: borderWidth, height: borderWidth }}>
          <Column
            {...bindSW()}
            style={{ maxWidth: borderWidth, cursor: "sw-resize" }}
          ></Column>
          <Column {...bindS()} style={{ cursor: "s-resize" }}></Column>
          <Column
            {...bindSE()}
            style={{ maxWidth: borderWidth, cursor: "se-resize" }}
          ></Column>
        </Row>
      </Footer>
    </Layout>
  );
}
