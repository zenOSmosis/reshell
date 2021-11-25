import { PhantomCollection, EVT_DESTROYED } from "phantom-core";
import VirtualServerZenRTCPeer, {
  EVT_UPDATED,
  // EVT_CONNECTING,
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  // EVT_DATA_RECEIVED,
  // EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
  // EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
  // EVT_SYNC_EVT_RECEIVED,
  EVT_ZENRTC_SIGNAL,
} from "./VirtualServerZenRTCPeer";

import SyncObject from "sync-object";

// import { fetch } from "@shared/SocketAPIClient";
// import { SOCKET_API_ROUTE_SET_NETWORK_BACKGROUND_IMAGE } from "@shared/socketAPIRoutes";

/*
import VirtualServerZenRTCSignalBroker, {
  SOCKET_EVT_ZENRTC_SIGNAL,
} from "./VirtualServerZenRTCSignalBroker";
*/

import VirtualServerPhantomPeer from "./VirtualServerPhantomPeer";

// import { uniqBy } from "lodash";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Keep exporting these?
export const EVT_PEER_CONNECTED = "peer-connected";
export const EVT_PEER_DISCONNECTED = "peer-disconnected";
export const EVT_PEER_DESTROYED = "peer-destroyed";
export const EVT_PEER_UPDATED = "peer-updated";

// TODO: Use secured indexeddb for storing of messages, etc.
// (i.e. something like: https://github.com/AKASHAorg/secure-webstore)

// TODO: Extend PhantomCollection instead?
/**
 * Manages the creation, updating, and destroying of VirtualServerZenRTCPeer instances.
 */
export default class VirtualServerZenRTCPeerManager extends PhantomCollection {
  /**
   * Gets the unique key to identify a peer.
   *
   * @param {string} clientDeviceAddress
   * @param {string} clientSignalBrokerId
   * @return {string}
   */
  static getPeerKey(clientDeviceAddress, clientSignalBrokerId) {
    return `${clientDeviceAddress}-${clientSignalBrokerId}`;
  }

  // TODO: Document
  constructor({ realmId, channelId, deviceAddress, socket }) {
    super();

    this._realmId = realmId;
    this._channelId = channelId;
    this._deviceAddress = deviceAddress;
    this._socket = socket;

    // TODO: Use local storage sync object, or web worker based
    // Shared between all peers
    this._sharedWritableSyncObject = new SyncObject({
      backgroundImage: null,

      peers: {},

      networkData: {},

      chatMessages: {},
    });

    this._networkName = null;
    this._networkDescription = null;

    // TODO: These binds may not be necessary w/ PhantomCore 2.0.0
    this._peerHasConnected = this._peerHasConnected.bind(this);
    this._peerHasUpdated = this._peerHasUpdated.bind(this);
    this._peerHasDisconnected = this._peerHasDisconnected.bind(this);
    this._peerHasDestroyed = this._peerHasDestroyed.bind(this);

    this._syncPeerData = this._syncPeerData.bind(this);
    this._syncLinkedMediaState = this._syncLinkedMediaState.bind(this);

    this.log("Listening for ZenRTCPeer connections");
  }

  // TODO: Document
  addChild(virtualServerZenRTCPeer, clientDeviceAddress, clientSignalBrokerId) {
    if (!(virtualServerZenRTCPeer instanceof VirtualServerZenRTCPeer)) {
      throw new TypeError(
        "virtualServerZenRTCPeer is not a VirtualServerZenRTCPeer instance"
      );
    }

    const peerKey = VirtualServerZenRTCPeerManager.getPeerKey(
      clientDeviceAddress,
      clientSignalBrokerId
    );

    return super.addChild(virtualServerZenRTCPeer, peerKey);
  }

  /**
   * @param {string} clientSocketId
   * @param {string} clientDeviceAddress
   * @param {string} clientSignalBrokerId
   * @return {VirtualServerZenRTCPeer}
   */
  getOrCreateZenRTCPeer(
    clientSocketId,
    clientDeviceAddress,
    clientSignalBrokerId
  ) {
    const existingPeer = this.getChildWithKey(
      VirtualServerZenRTCPeerManager.getPeerKey(
        clientDeviceAddress,
        clientSignalBrokerId
      )
    );

    if (existingPeer) {
      return existingPeer;
    } else {
      // Create peer

      const virtualServerZenRTCPeer = new VirtualServerZenRTCPeer({
        ourSocket: this._socket,
        realmId: this._realmId,
        channelId: this._channelId,
        clientSocketId,
        clientSignalBrokerId,

        // TODO: Re-enable sync objects

        // zenRTCSignalBrokerId: zenRTCSignalBrokerId,
        // NOTE: The writable is shared between all of the participants and
        // does not represent a single participant (it symbolized all of them)
        // writableSyncObject: this._sharedWritableSyncObject,
        // readOnlySyncObject,
      });

      // Register the peer in the collection
      this.addChild(
        virtualServerZenRTCPeer,
        clientDeviceAddress,
        clientSignalBrokerId
      );

      // Automatically connect
      virtualServerZenRTCPeer.connect();

      return virtualServerZenRTCPeer;
    }
  }

  /**
   * Gets, or creates, VirtualServerZenRTCPeer associated with the given
   * socketId.
   *
   * // @param {string} initiatorSocketIoId
   * @param {string} initiatorDeviceAddress
   * @param {string} initiatorSignalBrokerId
   * @return {VirtualServerZenRTCPeer} Returns a new, or cached, instance.
   */
  TODO_REMOVE_getOrCreateVirtualServerZenRTCPeer(
    // initiatorSocketIoId,
    initiatorDeviceAddress,
    initiatorSignalBrokerId
  ) {
    const cachedZenRTCInstance = this.getChildWithKey(initiatorSignalBrokerId);

    if (cachedZenRTCInstance) {
      return cachedZenRTCInstance;
    } else {
      // Create new instance
      this.log(
        `Creating new VirtualServerZenRTCPeer for initiator signal broker "${initiatorSignalBrokerId}"`
      );

      /**
       * Read the remote participant.
       */
      /*
      const readOnlySyncObject = new VirtualServerPhantomPeer(
        initiatorDeviceAddress,
        initiatorSignalBrokerId
      );
      */

      // const virtualParticipant = readOnlySyncObject;

      // TODO: Refactor beyond this point
      return;

      // const zenRTCSignalBrokerId = zenRTCSignalBroker.getUUID();

      // ZenRTC Peer
      /*
      const virtualServerZenRTCPeer = new VirtualServerZenRTCPeer({
        socketId: initiatorSocketIoId,
        // zenRTCSignalBrokerId: zenRTCSignalBrokerId,
        // NOTE: The writable is shared between all of the participants and
        // does not represent a single participant (it symbolized all of them)
        writableSyncObject: this._sharedWritableSyncObject,
        readOnlySyncObject,
      });

      this.registerShutdownHandler(() => {
        // zenRTCSignalBroker.destroy();
        virtualServerZenRTCPeer.destroy();
      });
      */

      // this.addChild(virtualServerZenRTCPeer, zenRTCSignalBrokerId);

      /*
      virtualServerZenRTCPeer.on(EVT_ZENRTC_SIGNAL, data =>
        zenRTCSignalBroker.signal(data)
      );
      */

      /*
      virtualServerZenRTCPeer.registerShutdownHandler(() => {
        this.log(
          `Destructing VirtualServerZenRTCPeer for initiator signal broker "${initiatorSignalBrokerId}"`
        );

        // IMPORTANT: Don't destroy the writable here as it is shared between
        // the other peers

        // TODO: Verify if any remaining sockets exist for the given
        // participant and delete, if not

        // Unbind zenRTCSignalBroker
        // zenRTCSignalBroker.destroy();
      });
      */

      // TODO: Uncomment or refactor
      // Carry profile and other shared information over to other peers
      //
      // Note the written object is sometimes augmented by internal calls to
      // this._syncLinkedMediaState()
      /*
      virtualParticipant.on(EVT_UPDATED, updatedState =>
        this._syncPeerData(
          virtualParticipant,
          zenRTCSignalBrokerId,
          updatedState
        )
      );
      */

      // TODO: Uncomment or refactor
      // Handle connect / disconnect peer bindings
      /*
      virtualServerZenRTCPeer.on(EVT_CONNECTED, () => {
        this._peerHasConnected(virtualServerZenRTCPeer);

        this._syncLinkedMediaState();
      });
      */

      // TODO: Uncomment or refactor
      /*
      virtualServerZenRTCPeer.on(EVT_UPDATED, () =>
        this._peerHasUpdated(virtualServerZenRTCPeer)
      );
      */

      // TODO: Uncomment or refactor
      /*
      virtualServerZenRTCPeer.on(EVT_DISCONNECTED, () => {
        this._syncRemovedVirtualParticipant(
          virtualParticipant,
          initiatorSocketIoId
        );

        this._peerHasDisconnected(virtualServerZenRTCPeer);
      });
      */

      // TODO: Uncomment or refactor
      /*
      virtualServerZenRTCPeer.registerShutdownHandler(() => {
        // Unregister zenRTCPeerEVT_CONNECTED
        delete this._virtualServerZenRTCInstances[initiatorSocketIoId];

        this._peerHasDestroyed(virtualServerZenRTCPeer);
      });
      */

      // TODO: Uncomment or refactor
      // Handle media stream routing
      //
      // TODO: Extract into class method
      /*
      (() => {
        // Sync new tracks with new peer
        virtualServerZenRTCPeer.on(
          EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
          async data => {
            const otherPeers =
              virtualServerZenRTCPeer.getOtherThreadInstances();

            // TODO: Remove
            // this.log.debug("incoming stream track added", {
            //   data,
            //   otherPeers,
            // });

            await Promise.all(
              otherPeers.map(peer =>
                peer.addOutgoingMediaStreamTrack(
                  data.mediaStreamTrack,
                  data.mediaStream
                )
              )
            );

            this._syncLinkedMediaState();
          }
        );

        // TODO: Uncomment or refactor
        // TODO: Extract into class method
        // Sync removed tracks with new peer
        virtualServerZenRTCPeer.on(
          EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
          async data => {
            const otherPeers =
              virtualServerZenRTCPeer.getOtherThreadInstances();

            this.log.debug("incoming stream track removed", {
              data,
              otherPeers,
            });

            await Promise.all(
              otherPeers.map(peer =>
                peer.removeOutgoingMediaStreamTrack(
                  data.mediaStreamTrack,
                  data.mediaStream
                )
              )
            );

            this._syncLinkedMediaState();
          }
        );
      })();
      */

      // Automatically connect
      /*
      virtualServerZenRTCPeer.connect();

      return virtualServerZenRTCPeer;
      */
    }
  }

  // TODO: Document
  setNetworkData({ networkName, networkDescription }) {
    this._networkName = networkName;
    this._networkDescription = networkDescription;

    // Sync network data to all peers
    this._sharedWritableSyncObject.setState({
      networkData: {
        realmId: this._realmId,
        channelId: this._channelId,
        networkName: this._networkName,
        networkDescription: this._networkDescription,
        hostDeviceAddress: this._deviceAddress,
      },
    });

    this.emit(EVT_UPDATED);
  }

  /**
   * Called when the given peer has connected.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  _peerHasConnected(virtualServerZenRTCPeer) {
    this.emit(EVT_PEER_CONNECTED, virtualServerZenRTCPeer);

    // Map streams from other peers to this peer
    (() => {
      const otherPeers = virtualServerZenRTCPeer.getOtherThreadInstances();

      otherPeers.forEach(otherPeer => {
        otherPeer
          .getIncomingMediaStreams()
          .forEach(mediaStream =>
            mediaStream
              .getTracks()
              .forEach(mediaStreamTrack =>
                virtualServerZenRTCPeer.addOutgoingMediaStreamTrack(
                  mediaStreamTrack,
                  mediaStream
                )
              )
          );
      });
    })();
  }

  /**
   * Called when the given peer has updated.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   */
  _peerHasUpdated(virtualServerZenRTCPeer) {
    this.emit(EVT_PEER_UPDATED, virtualServerZenRTCPeer);
  }

  // TODO: Document
  _peerHasDisconnected(virtualServerZenRTCPeer) {
    this.emit(EVT_PEER_DISCONNECTED, virtualServerZenRTCPeer);
  }

  // TODO: Document
  _peerHasDestroyed(virtualServerZenRTCPeer) {
    this.emit(EVT_PEER_DESTROYED, virtualServerZenRTCPeer);
  }

  // TODO: Refactor
  /**
   * Sync peer data (except for streaming media information) / chosen
   * background with other peers.
   *
   * @param {SyncObject} virtualParticipant
   * @param {string} zenRTCSignalBrokerId
   * @param {Object} updatedState
   * @return {void}
   */
  _syncPeerData(virtualParticipant, zenRTCSignalBrokerId, updatedState) {
    this.log.debug("Syncing virtual participant", virtualParticipant);

    // All peers will receive this
    const syncUpdate = {
      peers: {
        [zenRTCSignalBrokerId]: updatedState,
      },
    };

    // The background image
    if (updatedState.backgroundImage) {
      syncUpdate.backgroundImage = updatedState.backgroundImage;

      // Log to database so it can be visible on searched networks
      //
      // NOTE: Intentionally not awaiting fetch to resolve
      /*
      fetch(SOCKET_API_ROUTE_SET_NETWORK_BACKGROUND_IMAGE, {
        backgroundImage: updatedState.backgroundImage,
      });
      */

      // TODO: Cache backgroundImage property in local storage
    }

    if (updatedState.chatMessages) {
      syncUpdate.chatMessages = updatedState.chatMessages;
    }

    if (Object.keys(updatedState).length) {
      this._sharedWritableSyncObject.setState(syncUpdate);
    }
  }

  // TODO: Refactor
  /**
   * Sync incoming media streaming information with other peers.
   *
   * @return {void}
   */
  _syncLinkedMediaState() {
    const peers = {};

    for (const zenRTCPeer of VirtualServerZenRTCPeer.getInstances()) {
      const signalBrokerIdFrom = zenRTCPeer.getSignalBrokerId();

      /**
       * @type {string} CSV representation of incoming media stream ids
       */
      const media = zenRTCPeer
        .getIncomingMediaStreams()
        .map(({ id }) => id)
        .join(",");

      peers[signalBrokerIdFrom] = {
        media,
      };
    }

    this._sharedWritableSyncObject.setState({
      peers,
    });
  }

  // TODO: Refactor
  /**
   * Sync removed participant with other peers.
   *
   * @param {SyncObject} virtualParticipant
   * @param {string} zenRTCSignalBrokerId
   * @return {void}
   */
  _syncRemovedVirtualParticipant(virtualParticipant, zenRTCSignalBrokerId) {
    this.log.debug("Removing virtual participant", virtualParticipant);

    this._sharedWritableSyncObject.setState({
      peers: {
        // IMPORTANT: At this time, SyncObject does not support setting
        // undefined and syncing over the wire, so null is used instead
        [zenRTCSignalBrokerId]: null,
      },
    });
  }

  /**
   * Retrieves all VirtualServerZenRTCPeer instances defined in this thread.
   *
   * @return {VirtualServerZenRTCPeer[]}
   */
  getPeers() {
    return Object.values(this._virtualServerZenRTCInstances);
  }

  /**
   * @return {Promise{void>}}
   */
  async destroy() {
    this.log("Stop listening for ZenRTCPeer connections");

    // Destroy all associated zenRTC peers
    await Promise.all(
      Object.values(this._virtualServerZenRTCInstances).map(zenRTCPeer =>
        zenRTCPeer.destroy()
      )
    );

    if (this._sharedWritableSyncObject) {
      await this._sharedWritableSyncObject.destroy();
    }

    await super.destroy();
  }
}
