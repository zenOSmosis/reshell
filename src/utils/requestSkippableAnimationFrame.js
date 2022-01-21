// TODO: Implement ability to delete pending frame group

const addFrameHandler = (() => {
  /** @type {Object.Array<frameFunc: function, priority: number>} */
  const frameGroups = {};

  let isRunning = false;

  let idx = -1;

  function _batchRunner(/* timestamp */) {
    isRunning = true;

    ++idx;

    const groupNames = Object.keys(frameGroups);

    const lenGroupNames = groupNames.length;
    let pending = lenGroupNames;

    for (const groupName of groupNames) {
      const [frameFunc, priority] = frameGroups[groupName];

      if (!(idx % priority)) {
        frameFunc();

        delete frameGroups[groupName];

        --pending;
      }
    }

    // Don't run if there is no more work to do
    if (pending) {
      // Loop
      window.requestAnimationFrame(_batchRunner);
    } else {
      isRunning = false;
    }
  }

  return function addFrameHandler(groupName, frameFunc, priority) {
    frameGroups[groupName] = [frameFunc, priority];

    if (!isRunning) {
      _batchRunner();
    }
  };
})();

/**
 * Extends requestAnimationFrame with skippable frame batching operations.
 *
 * @param {function} frameFunc The function to execute when the screen renders
 * @param {string} groupName The group which the function should reside in
 * @param {number} priority An integer greater or equal to 1; where 1 will
 * render the last frameFunc in the group on every render frame, and higher
 * numbers will render every nth frame
 */
export default function requestSkippableAnimationFrame(
  frameFunc,
  groupName,
  priority = 3
) {
  // FIXME: (jh) Determine if these checks have a significant performance
  // impact
  /*
  if (!groupName) {
    throw new ReferenceError(
      "groupName is not found on requestSkippableAnimationFrame caller"
    );
  }

  priority = parseInt(priority, 10);
  if (priority < 1 || priority > 10) {
    throw new RangeError("priority must be an integer greater or equal to 1");
  }
  */

  addFrameHandler(groupName, frameFunc, priority);
}
