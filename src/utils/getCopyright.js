const FULL_YEAR = new Date().getFullYear();

// FIXME: (jh) Rename to getReShellCopyright
/**
 * @return {string}
 */
export default function getCopyright() {
  return `Copyright © 2010 - ${FULL_YEAR} zenOSmosis. All rights reserved.`;
}
