import Layout, { Header, Content, Footer, Row, Column } from "../Layout";
import { useDrag } from "@use-gesture/react";

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
  const bindNW = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_NW, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  const bindN = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_N, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  const bindNE = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_NE, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  const bindE = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_E, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  const bindSE = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_SE, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  const bindS = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_S, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  const bindSW = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_SW, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  const bindW = useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(DIR_BORDER_W, { mx, my, isDragging });
    },
    { pointer: { touch: true } }
  );

  return (
    // TODO: Enable merge-able styles / classNames
    // TODO: Extract classes to module.css
    <Layout {...rest}>
      <Header>
        {!isDisabled && (
          <Row style={{ maxHeight: borderWidth, height: borderWidth }}>
            <Column
              {...bindNW()}
              style={{ maxWidth: borderWidth, cursor: "nwse-resize" }}
            ></Column>
            <Column {...bindN()} style={{ cursor: "ns-resize" }}></Column>
            <Column
              {...bindNE()}
              style={{ maxWidth: borderWidth, cursor: "nesw-resize" }}
            ></Column>
          </Row>
        )}
      </Header>
      <Content>
        <Row>
          {!isDisabled && (
            <Column
              {...bindW()}
              style={{ maxWidth: borderWidth, cursor: "ew-resize" }}
            ></Column>
          )}

          <Column>
            {
              // TODO: Use layout to wrap the child in a frame, w/ diagonal positions included
            }
            {children}
          </Column>
          {!isDisabled && (
            <Column
              {...bindE()}
              style={{ maxWidth: borderWidth, cursor: "ew-resize" }}
            ></Column>
          )}
        </Row>
      </Content>
      <Footer>
        {!isDisabled && (
          <Row style={{ maxHeight: borderWidth, height: borderWidth }}>
            <Column
              {...bindSW()}
              style={{ maxWidth: borderWidth, cursor: "nesw-resize" }}
            ></Column>
            <Column {...bindS()} style={{ cursor: "ns-resize" }}></Column>
            <Column
              {...bindSE()}
              style={{ maxWidth: borderWidth, cursor: "nwse-resize" }}
            ></Column>
          </Row>
        )}
      </Footer>
    </Layout>
  );
}
