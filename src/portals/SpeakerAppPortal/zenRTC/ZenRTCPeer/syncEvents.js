/**
 * Events which are sent / received over WebRTC data channel (UDP transmission).
 *
 * IMPORTANT: Since these are UDP events, they are not guaranteed to be
 * delivered successfully or accurately, and it is up to the implementation to
 * make its own integrity checks.
 *
 * @see socketEvents.js for events emit over Socket.io.
 */

/**
 * Ping / Pong events emit to detect latency and potential connection issues.
 *
 * Ping is emit to the other peer, and pong is emit back to the original peer
 * immediately after receipt.
 **/

/**
 * @event ping
 * @type {void}
 */
export const SYNC_EVT_PING = "ping";

/**
 * @event pong
 * @type {void}
 */
export const SYNC_EVT_PONG = "pong";

/**
 * Emits before intentional disconnect so the other peer can be aware of a
 * graceful disconnection and immediately make preparations to handle the
 * shutdown.
 *
 * @event bye
 * @type {void}
 */
export const SYNC_EVT_BYE = "bye";

/**
 * Emits when one peer wishes to kick the other peer off of a connection.
 *
 * @event kick
 * @type {void}
 */
export const SYNC_EVT_KICK = "kick";

/**
 * This was added because WebRTCPeer / SimplePeer doesn't notify of track
 * removal on its own.
 *
 * @event mst-
 * @type {Object} Contains msid (media stream id) and kind (track kind)
 * properties.
 */
export const SYNC_EVT_TRACK_REMOVED = "mst-";

/**
 * Emits, with any data, when a client wishes a remote peer to debug data in
 * the console (for development purposes only).
 *
 * @event debug
 * @type {any} Any serializable data which can be sent to the remote peer.
 */
export const SYNC_EVT_DEBUG = "debug";

/**
 * Emits when there is a partial state update to send through a SyncObject.
 *
 * @link https://github.com/zenOSmosis/sync-object/blob/master/src/SyncObject.js
 *
 * @event s0 Partial sync object sync
 * @type {Object} Partial state
 */
export const SYNC_EVT_SYNC_OBJECT_PARTIAL_SYNC = "s0";

/**
 * Emits when there is a complete state to send through a SyncObject.
 *
 * @link https://github.com/zenOSmosis/sync-object/blob/master/src/SyncObject.js
 *
 * @event s1 Full sync object sync
 * @type {Object} Full state
 */
export const SYNC_EVT_SYNC_OBJECT_FULL_SYNC = "s1";

/**
 * Emits when there is a state update hash, used for remote state sync
 * integrity checking.
 *
 * @link https://github.com/zenOSmosis/sync-object/blob/master/src/SyncObject.js
 *
 * @event s2 Update hash
 * @type {string} The hash which represents full state
 */
export const SYNC_EVT_SYNC_OBJECT_UPDATE_HASH = "s2";

/**
 * TODO: Implement sync event for request to open up arbitrary data channels.
 *
 * Utilize ZenRTCPeer.DataChannelManagerModule regardless of the implementation.
 * Let it manage the data channels, and refactor DataChannelManagerModule if it
 * can be more efficient. Do not trust WebRTCPeer / SimplePeer to manage
 * additional data channels directly, as it is not currently set up to do so.
 *
 * Look at this for reference:
 * @see https://github.com/feross/simple-peer/pull/694
 */

// TODO: Add unit test which ensures all of these values are unique
