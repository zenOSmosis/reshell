import PhantomCore, { EVT_READY, EVT_DESTROYED } from "phantom-core";
import VirtualServerZenRTCPeerManager, {
  EVT_PEER_CONNECTED,
  EVT_PEER_SHARED_STATE_UPDATED,
  EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
  EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_PEER_DISCONNECTED,
  EVT_PEER_DESTROYED,
} from "./subClasses/VirtualServerZenRTCPeerManager";
import VirtualServerZenRTCPeerMediaStreamRouter from "./subClasses/VirtualServerZenRTCPeerMediaStreamRouter";

import SyncObject from "sync-object";

import { SOCKET_EVT_ZENRTC_SIGNAL } from "./subClasses/VirtualServerZenRTCSignalBroker";

import {
  SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
  SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION,
} from "../../shared/socketAPIRoutes";

export { EVT_READY, EVT_DESTROYED };

// TODO: Document
export default class ZenRTCVirtualServer extends PhantomCore {
  // TODO: Document
  constructor({
    realmId,
    channelId,
    networkName,
    networkDescription,
    isPublic,
    deviceAddress,
    buildHash,
    userAgent,
    socketService,
  }) {
    super({ isAsync: true });

    this._realmId = realmId;
    this._channelId = channelId;
    this._networkName = networkName;
    this._networkDescription = networkDescription;
    this._isPublic = isPublic;
    this._deviceAddress = deviceAddress;
    this._buildHash = buildHash;
    this._userAgent = userAgent;

    // TODO: Move to virtual server
    // TODO: Use local storage sync object, or web worker based
    // Shared between all peers
    this._sharedWritableSyncObject = new SyncObject({
      // backgroundImage: null,
      phantomPeers: {},
      // networkData: {},
      // chatMessages: {},
    });

    this._socketService = socketService;
    this._socket = socketService.getSocket();

    this._mediaStreamRouter = new VirtualServerZenRTCPeerMediaStreamRouter();
    this.registerShutdownHandler(() => this._mediaStreamRouter.destroy());

    // Will be defined during _init sequence
    this._peerManager = null;

    this._init().catch(err => {
      this.log.error(err);

      // Automatically destruct if not able to init
      this.destroy();
    });
  }

  // TODO: Document
  async _init() {
    // Start managing peers (IMPORTANT: Must come before initSocketListener)
    this._initPeerManager();

    // Start listening for socket events
    this._initSocketListener();

    // Tell the real server we're starting a session
    await this._emitSessionStart();

    // When destructed, tell the real server we're stopping the session
    this.registerShutdownHandler(() => this._emitSessionEnd());

    return super._init();
  }

  // TODO: Document
  _initPeerManager() {
    this._peerManager = new VirtualServerZenRTCPeerManager({
      realmId: this._realmId,
      channelId: this._channelId,
      deviceAddress: this._deviceAddress,
      socket: this._socket,
      sharedWritableSyncObject: this._sharedWritableSyncObject,
    });

    this._peerManager.on(EVT_PEER_CONNECTED, zenRTCPeer => {
      this._mediaStreamRouter.addChild(zenRTCPeer);

      // TODO: Remove
      console.log("zenRTCPeer connected", zenRTCPeer);

      // TODO: Re-emit
    });

    this._peerManager.on(
      EVT_PEER_SHARED_STATE_UPDATED,
      ([zenRTCPeer, readOnlyUpdatedState]) => {
        // TODO: Remove
        console.log("zenRTCPeer read-only state updated", {
          zenRTCPeer,
          readOnlyUpdatedState,
          readOnlyFullState: zenRTCPeer.getReadOnlySyncObject().getState(),
        });

        // TODO: Re-emit
      }
    );

    /*
    this._peerManager.on(
      EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
      ([zenRTCPeer, mediaStreamTrack]) => {
        // TODO: Remove
        console.log("zenRTCPeer added outgoing media stream track", {
          zenRTCPeer,
          mediaStreamTrack,
        });
      }
    );
    */

    /*
    this._peerManager.on(
      EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
      ([zenRTCPeer, mediaStreamTrack]) => {
        // TODO: Remove
        console.log("zenRTCPeer removed outgoing media stream track", {
          zenRTCPeer,
          mediaStreamTrack,
        });
      }
    );
    */

    this._peerManager.on(
      EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_ADDED,
      ([zenRTCPeer, mediaStreamData]) => {
        // TODO: Remove
        console.log("zenRTCPeer added incoming media stream track", {
          zenRTCPeer,
          mediaStreamData,
        });

        const { mediaStreamTrack, mediaStream } = mediaStreamData;

        this._mediaStreamRouter.addOutgoingMediaStreamTrack(
          zenRTCPeer,
          mediaStreamTrack,
          mediaStream
        );
      }
    );

    this._peerManager.on(
      EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
      ([zenRTCPeer, mediaStreamData]) => {
        // TODO: Remove
        console.log("zenRTCPeer removed incoming media stream track", {
          zenRTCPeer,
          mediaStreamData,
        });

        const { mediaStreamTrack, mediaStream } = mediaStreamData;

        this._mediaStreamRouter.removeOutgoingMediaStreamTrack(
          zenRTCPeer,
          mediaStreamTrack,
          mediaStream
        );
      }
    );

    this._peerManager.on(EVT_PEER_DISCONNECTED, zenRTCPeer => {
      // TODO: Remove
      console.log("zenRTCPeer disconnected", zenRTCPeer);

      // TODO: Re-emit
    });

    this._peerManager.on(EVT_PEER_DESTROYED, zenRTCPeer => {
      // TODO: Remove
      console.log("zenRTCPeer destructed", zenRTCPeer);

      // TODO: Re-emit
    });

    this.registerShutdownHandler(() => this._peerManager.destroy());
  }

  // TODO: Document
  _initSocketListener() {
    const socket = this._socket;

    // Listens for SOCKET_EVT_ZENRTC_SIGNAL on the socket connection and
    // determines if they should be routed to a relevant peer on this virtual
    // network
    const _handleReceiveZenRTCSignal = signal => {
      const {
        socketIdFrom,
        senderDeviceAddress,
        signalBrokerIdFrom,
        realmId,
        channelId,
        signalBrokerIdTo,
      } = signal;

      if (
        // IMPORTANT: Clients do not know the signalBrokerId they are sending
        // to, as the virtual server's signal broker isn't set up for that
        // client until the message is received
        signalBrokerIdTo === undefined &&
        realmId === this._realmId &&
        channelId === this._channelId
      ) {
        const zenRTCPeer = this._peerManager.getOrCreateZenRTCPeer(
          socketIdFrom,
          senderDeviceAddress,
          signalBrokerIdFrom
        );

        zenRTCPeer.receiveZenRTCSignal(signal);
      }
    };

    socket.on(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveZenRTCSignal);

    // Unbind from socket when destructed
    this.registerShutdownHandler(() =>
      socket.off(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveZenRTCSignal)
    );
  }

  // TODO: Document
  async _emitSessionStart() {
    // Register server on network
    return this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
      {
        realmId: this._realmId,
        channelId: this._channelId,
        networkName: this._networkName,
        networkDescription: this._networkDescription,
        isPublic: this._isPublic,
        deviceAddress: this._deviceAddress,
        buildHash: this._buildHash,
        userAgent: this._userAgent,
      }
    );
  }

  // TODO: Document
  async _emitSessionEnd() {
    await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION
    );
  }
}
