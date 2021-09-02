import React from "react";

export const ParadigmContext = React.createContext({});

// TODO: Add desktop paradigm
// TODO: Add mobile paradigm
// TODO: Add card paradigm: https://codesandbox.io/embed/j0y0vpz59

export default function ParadigmProvider({ children }) {
  // TODO: Work out paradigm values; use PhantomCollection for paradigm management
  return (
    <ParadigmContext.Provider value={{}}>{children}</ParadigmContext.Provider>
  );
}
