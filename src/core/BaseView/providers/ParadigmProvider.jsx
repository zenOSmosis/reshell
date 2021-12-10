import React from "react";

export const ParadigmContext = React.createContext({});

// TODO: Add desktop paradigm
// TODO: Add mobile paradigm (half-quadrant snapping; scroll dock / scroll side-by-side-apps / views able to be split vertically / horizontally, and windows able to be dragged into quadrants / scaling optional)
// TODO: Link to service which can control / monitor active paradigm (or just use context...)

export default function ParadigmProvider({ children }) {
  // TODO: Work out paradigm values; use PhantomCollection for paradigm management
  return (
    <ParadigmContext.Provider value={{}}>{children}</ParadigmContext.Provider>
  );
}
