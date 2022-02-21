import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./Dock.module.css";

// TODO: Document
// TODO: Add prop-types
export default function DockItem({
  appRegistration,
  isActiveRegistration,
  onClick,
  elDock,
}) {
  const [elDockItem, _setElDockItem] = useState(null);

  // Automatically scroll to relevant dock item when active
  useEffect(() => {
    if (elDock && elDockItem && isActiveRegistration) {
      const offsetLeft = elDockItem.offsetLeft;
      const offsetTop = elDockItem.offsetTop;

      elDock.scrollTo({
        top: offsetTop,
        left: offsetLeft,
        behavior: "smooth",
      });
    }
  }, [elDock, elDockItem, isActiveRegistration]);

  return (
    <button
      ref={_setElDockItem}
      className={classNames(
        styles["dock-item"],
        isActiveRegistration && styles["active"]
      )}
      onClick={onClick}
    >
      {appRegistration.getTitle()}
    </button>
  );
}
