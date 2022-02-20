import Layout, { Header, Content, Footer, Row, Column } from "../Layout";
import { useDrag } from "@use-gesture/react";

// FIXME: (jh) Look into resizble element for touch displays: https://csslayout.io/resizable-element/

export const DIR_BORDER_NW = "NW";
export const DIR_BORDER_N = "N";
export const DIR_BORDER_NE = "NE";
export const DIR_BORDER_E = "E";
export const DIR_BORDER_SE = "SE";
export const DIR_BORDER_S = "S";
export const DIR_BORDER_SW = "SW";
export const DIR_BORDER_W = "W";

// @see https://use-gesture.netlify.app/docs/#simple-example
const useDirectionalDragger = function (direction, onBorderDrag) {
  return useDrag(
    ({ down: isDragging, movement: [mx, my] }) => {
      onBorderDrag(direction, { mx, my, isDragging });
    },
    {
      pointer: {
        // IMPORTANT: This makes use-gesture utilize touch events instead of
        // pointer events and fixes an issue where pointercancel would
        // sometimes be fired on certain Android devices
        touch: true,
      },
    }
  );
};

// TODO: Use prop-types
// TODO: Document
export default function WindowBorder({
  children,
  onBorderDrag,
  // FIXME: (jh) Document how height and width are synonymous
  borderWidth = 3,
  isDisabled = false,
  ...rest
}) {
  const bindNW = useDirectionalDragger(DIR_BORDER_NW, onBorderDrag);
  const bindN = useDirectionalDragger(DIR_BORDER_N, onBorderDrag);
  const bindNE = useDirectionalDragger(DIR_BORDER_NE, onBorderDrag);
  const bindE = useDirectionalDragger(DIR_BORDER_E, onBorderDrag);
  const bindSE = useDirectionalDragger(DIR_BORDER_SE, onBorderDrag);
  const bindS = useDirectionalDragger(DIR_BORDER_S, onBorderDrag);
  const bindSW = useDirectionalDragger(DIR_BORDER_SW, onBorderDrag);
  const bindW = useDirectionalDragger(DIR_BORDER_W, onBorderDrag);

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
