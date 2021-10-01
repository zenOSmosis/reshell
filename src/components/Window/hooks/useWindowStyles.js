import { useMemo } from "react";

// TODO: Document
export default function useWindowStyles({ style, isMaximized, isMinimized }) {
  // Conditionally overrides style property when window is maximized or
  // minimized so that they do not conflict with the CSS classes
  const outerBorderStyle = useMemo(() => {
    if (isMaximized || isMinimized) {
      return {};
    } else {
      return {
        width: style.width,
        height: style.height,
      };
    }
  }, [style.width, style.height, isMaximized, isMinimized]);

  const windowStyle = useMemo(() => {
    return {
      backgroundColor: style.backgroundColor,
    };
  }, [style.backgroundColor]);

  const bodyStyle = useMemo(() => {
    return {
      padding: style.padding,
    };
  }, [style.padding]);

  return {
    outerBorderStyle,
    windowStyle,
    bodyStyle,
  };
}
