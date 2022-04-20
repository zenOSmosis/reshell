/**
 * Faked window properties to allow Sentencer to run in web worker.
 *
 * Related issue:
 * @see https://github.com/kylestetz/Sentencer/issues/28
 */

// TODO: Randomize values (preferably w/ randomized getters)
global.window = {
  history: [...new Array(5).fill(1)],
  outerHeight: 1024,
  outerWidth: 1024,
  screenX: 1024,
  screenY: 1024,
  screen: {
    availWidth: 1024,
    availHeight: 1024,
    height: 1024,
    width: 1024,
  },
};
