/**
 * Keys for client-side local storage usage.
 */

/**
 * The number of times the UI has been loaded for the current user on this
 * device.
 *
 * @type {number}
 */
export const KEY_HISTORICAL_SESSION_COUNT = "h0a";

/**
 * Contains local profile details.
 *
 * @type {Object}
 */
export const KEY_LOCAL_PROFILE = "p0a";

/**
 * Contains local audio defaults.
 *
 * @type {Object}
 */
export const KEY_LOCAL_AUDIO_INPUT_DEVICES_CACHE = "ac0a";

/**
 * Contains client address and keys.  Should not be shared directly with other
 * peers.
 *
 * @type {Object}
 */
export const KEY_SERVICE_AUTHORIZATION = "a0a";

/**
 * Remembers cached form values from previous sessions.
 *
 * @type {Object}
 */
export const KEY_VIRTUAL_SERVER_LOCAL_STORAGE_CREDS = "t0a";

/**
 * Is set to true if the virtualServer manually logged out.
 *
 * If the value is set to true, it should prevent the virtualServer auto-reconnect
 * mechanism from reconnecting, as part of the design.
 *
 * @type {boolean}
 */
export const KEY_VIRTUAL_SERVER_DID_MANUALLY_LOGOUT = "m0a";
