const FULL_YEAR = new Date().getFullYear();

/**
 * @return {string}
 */
export default function getCopyright() {
  return `Copyright © 2010 - ${FULL_YEAR} zenOSmosis. All rights reserved.`;
}
