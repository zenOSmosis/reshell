import React, { useEffect, useMemo, useState } from "react";

// IMPORTANT: All other view components must be loaded as children of this
// component, and not included directly here, or the CSS modules may not load
// (i.e. put all view components inside of PortalWrapper)

// TODO: Document and add prop-types
export default function BaseView({ portal }) {
  const [areBaseStylesLoaded, setAreBaseStylesLoaded] = useState(false);

  useEffect(() => {
    // Lazy-load BaseView style so it doesn't override before the app is mounted
    //
    // TODO: Use usePreload hook
    import("./base-styles.css")
      .then(() => setAreBaseStylesLoaded(true))
      .catch(err => console.error(err));
  }, []);

  const PortalWrapper = useMemo(
    () => React.lazy(() => import("./PortalWrapper")),
    []
  );

  if (!areBaseStylesLoaded) {
    // TODO: Display configurable fallback message / component
    return null;
  }

  return (
    <React.Suspense fallback={<div>Loading base utilities...</div>}>
      <PortalWrapper portal={portal} />
    </React.Suspense>
  );
}
