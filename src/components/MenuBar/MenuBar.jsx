import { useEffect, useState } from "react";
import Menu from "../Menu";
import NoWrap from "../NoWrap";

import PropTypes from "prop-types";

// FIXME: (jh) Implement keyboard accessibility across menu bar: https://szhsin.github.io/react-menu/docs#keyboard

MenuBar.propTypes = {
  /**
   * FIXME: (jh) Document structure
   *
   * Reference example:
   * @see {@link https://www.electronjs.org/docs/api/menu#examples}
   */
  menuStructures: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function MenuBar({ menuStructures = [] }) {
  const [openedIndexes, _setOpenedIndexes] = useState([]);
  const [isActive, _setIsActive] = useState(false);

  // Set active state depending on if there are opened menu indexes
  useEffect(() => {
    const nextIsActive = Boolean(openedIndexes.length);

    if (isActive !== nextIsActive) {
      _setIsActive(nextIsActive);

      if (!nextIsActive) {
        _setOpenedIndexes([]);
      }
    }
  }, [isActive, openedIndexes]);

  // Reset menus if there is an open index registered to a now non-existent
  // menu structure index
  useEffect(() => {
    for (const idx of openedIndexes) {
      if (!menuStructures[idx]) {
        _setOpenedIndexes([]);
        _setIsActive(false);

        break;
      }
    }
  }, [openedIndexes, menuStructures]);

  // FIXME: (jh) Determine if overflown, and adjust layout as necessary (perhaps
  // by converging menu data structures)

  return (
    <NoWrap>
      {menuStructures.map(
        (menuStructure, idx) =>
          menuStructure && (
            <Menu
              key={idx}
              menuStructure={menuStructure}
              onOpen={() =>
                // Add this idx to list of opened indexes, if not already added
                _setOpenedIndexes(prev => [...new Set([...prev, idx])])
              }
              onClose={() =>
                // Remove this idx from list of opened indexes
                _setOpenedIndexes(prev => prev.filter(pred => pred !== idx))
              }
              opened={Boolean(openedIndexes.includes(idx))}
              onMouseOver={() => {
                if (isActive) {
                  if (!openedIndexes.includes(idx)) {
                    // Close other menus
                    _setOpenedIndexes([idx]);
                  }
                }
              }}
            />
          )
      )}
    </NoWrap>
  );
}
