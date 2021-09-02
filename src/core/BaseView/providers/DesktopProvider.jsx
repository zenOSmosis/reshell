import React, { useEffect, useState } from "react";

export const DesktopContext = React.createContext({});

const DEFAULT_DOCUMENT_TITLE = document.title;

export default function DesktopProvider({ children }) {
  // TODO: Add all window controllers here so they can be passed to other applications more easily

  const [activeWindowController, setActiveWindowController] = useState(null);
  const [backgroundVideoMediaStreamTrack, setBackgroundVideoMediaStreamTrack] =
    useState(null);

  useEffect(() => {
    document.title =
      (activeWindowController &&
        `${activeWindowController.getTitle()} | ${DEFAULT_DOCUMENT_TITLE}`) ||
      DEFAULT_DOCUMENT_TITLE;

    // TODO: Subscribe to updates and set title accordingly
  }, [activeWindowController]);

  // TODO: Remove
  // console.log({ activeWindowController });

  return (
    <DesktopContext.Provider
      value={{
        activeWindowController,
        setActiveWindowController,
        backgroundVideoMediaStreamTrack,
        setBackgroundVideoMediaStreamTrack,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}
