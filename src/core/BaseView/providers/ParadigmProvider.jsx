import React from "react";

export const ParadigmContext = React.createContext({});

// TODO: Add desktop paradigm
// TODO: Add mobile paradigm (half-quadrant snapping; scroll dock / scroll side-by-side-apps / views able to be split vertically / horizontally, and windows able to be dragged into quadrants / scaling optional)

export default function ParadigmProvider({ children }) {
  // TODO: Work out paradigm values; use PhantomCollection for paradigm management
  return (
    <ParadigmContext.Provider value={{}}>{children}</ParadigmContext.Provider>
  );
}
