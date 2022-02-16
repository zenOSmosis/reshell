import { PhantomCollection } from "phantom-core";
import VirtualServerZenRTCPeer from "../VirtualServerZenRTCPeer";
import hash from "object-hash";

import { STATE_KEY_LAST_CHAT_MESSAGE } from "../../../PhantomPeerSyncObject";

import SyncObject from "sync-object";

// TODO: Send remote remove event when peer has disconnected?

/**
 * Performs state routing for all of the peers.
 */
export default class VirtualServerZenRTCPeerPhantomPeerRouter extends PhantomCollection {
  /**
   * @param {SyncObject} sharedWritableSyncObject
   */
  constructor(sharedWritableSyncObject) {
    if (!(sharedWritableSyncObject instanceof SyncObject)) {
      throw new TypeError(
        "sharedWritableSyncObject is not a SyncObject instance"
      );
    }

    super();

    this._sharedWritableSyncObject = sharedWritableSyncObject;
    this.registerCleanupHandler(() => (this._sharedWritableSyncObject = null));

    // Chat messages for the entire session
    //
    // NOTE: These are in object form since they will be synced over SyncObject
    // which does not support arrays at this time (as of Jan. 13 2022)
    this._chatMessages = {};
    this._chatMessagesHash = null;
  }

  /**
   * Adds a VirtualServerZenRTCPeer instance to the router collection and sets
   * up an initial full state sync.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  addChild(virtualServerZenRTCPeer) {
    if (!(virtualServerZenRTCPeer instanceof VirtualServerZenRTCPeer)) {
      throw new TypeError(
        "virtualServerZenRTCPeer is not a VirtualServerZenRTCPeer instance"
      );
    }

    // Duplicate attempts will be silently ignored
    super.addChild(virtualServerZenRTCPeer);

    // IMPORTANT: This must come after super.addChild as other peers are
    // determined by the collection's children
    this.sync(virtualServerZenRTCPeer);
  }

  // TODO: Document
  /**
   * IMPORTANT: It is important to know that the underlying mechanism for this
   * is SyncObject, which performs differential state updates across the wire.
   *
   * As such, it currently does not handle arrays and state deletions must be
   * nulled out.
   *
   * @see https://github.com/zenOSmosis/sync-object
   *
   * @return {void}
   */
  sync() {
    // Contains all of the remote peer states, which will be written to the
    // shared writable sync object and synced to all of the clients
    const batchPeersUpdate = {};

    for (const zenRTCPeer of this.getChildren()) {
      const readOnlySyncObject = zenRTCPeer.getReadOnlySyncObject();
      const clientSignalBrokerId = zenRTCPeer.getClientSignalBrokerId();

      const isPeerConnected = zenRTCPeer.getIsConnected();

      // Obtains a shallow-copy of the readOnly state so that the base keys can
      // be manipulated without affecting the state store
      const readOnlyState = isPeerConnected && {
        ...readOnlySyncObject.getState(),
      };

      // Don't sync last chat message directly with other peers
      //
      // FIXME: (jh) This coincides with the chat functionality in this.handlePeerSharedStateUpdated().
      // It should probably be cleaned up.
      delete readOnlyState[STATE_KEY_LAST_CHAT_MESSAGE];

      // TODO: Remove
      console.log(
        "length incoming media streams",
        zenRTCPeer.getIncomingMediaStreams().length
      );

      if (isPeerConnected) {
        batchPeersUpdate[clientSignalBrokerId] = {
          ...readOnlyState,
          media: zenRTCPeer
            .getIncomingMediaStreams()
            .map(({ id }) => id)
            .join(","),
        };
      } else {
        // Delete the shared client state
        //
        // TODO: Fix issue where setting undefined does not sync the hash
        // across the wire
        // @see https://github.com/zenOSmosis/sync-object/issues/40
        batchPeersUpdate[clientSignalBrokerId] = null;
      }
    }

    this._sharedWritableSyncObject.setState({
      peers: batchPeersUpdate,
      chatMessages: this._chatMessages,
      chatMessagesHash: this._chatMessagesHash,
    });
  }

  /**
   * Called by the virtual server when there are updated incoming media
   * streams.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  handlePeerIncomingMediaStreamsUpdated(virtualServerZenRTCPeer) {
    this.sync(virtualServerZenRTCPeer);
  }

  /**
   * Called by the virtual server when a client updates their shared state.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @param {Object} readOnlyUpdatedState
   * @return {void}
   */
  handlePeerSharedStateUpdated(virtualServerZenRTCPeer, readOnlyUpdatedState) {
    // Remove last chat message from peer state and add to session chat messages
    // TODO: Clean up and document (also coincides with some functionality in
    // this.sync())
    if (
      readOnlyUpdatedState &&
      readOnlyUpdatedState[STATE_KEY_LAST_CHAT_MESSAGE] &&
      Object.values(readOnlyUpdatedState[STATE_KEY_LAST_CHAT_MESSAGE]).length
    ) {
      Object.assign(this._chatMessages, {
        [Object.values(this._chatMessages).length]: {
          ...readOnlyUpdatedState[STATE_KEY_LAST_CHAT_MESSAGE],
          // FIXME: (jh) Implement a more elaborate way of obtaining remote
          // device address
          senderAddress: virtualServerZenRTCPeer
            .getReadOnlySyncObject()
            .getState().deviceAddress,
        },
      });

      this._chatMessagesHash = hash(this._chatMessages);
    }

    this.sync(virtualServerZenRTCPeer);
  }

  /**
   * Called by the virtual server when a client disconnects.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  handlePeerDisconnect(virtualServerZenRTCPeer) {
    this.sync(virtualServerZenRTCPeer);
  }
}
