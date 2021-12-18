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

import VirtualServerZenRTCPeerPhantomPeerRouter from "./subClasses/routers/VirtualServerZenRTCPeerPhantomPeerRouter";
import VirtualServerZenRTCPeerMediaStreamRouter from "./subClasses/routers/VirtualServerZenRTCPeerMediaStreamRouter";

import SyncObject from "sync-object";

import { SOCKET_EVT_ZENRTC_SIGNAL } from "./subClasses/VirtualServerZenRTCSignalBroker";

import {
  SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
  SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION,
  SOCKET_API_ROUTE_SET_NETWORK_PARTICIPANT_COUNT,
} from "../../shared/socketAPIRoutes";

export { EVT_READY, EVT_DESTROYED };

// TODO: Use secured indexeddb for storing of messages, etc.
// (i.e. something like: https://github.com/AKASHAorg/secure-webstore)

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
    iceServers,
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
    this._iceServers = iceServers;

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

    this._phantomPeerRouter = new VirtualServerZenRTCPeerPhantomPeerRouter();
    this.registerShutdownHandler(() => this._phantomPeerRouter.destroy());

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
      iceServers: this._iceServers,
      sharedWritableSyncObject: this._sharedWritableSyncObject,
    });

    // Auto-destruct peerManager once class is destructed
    this.registerShutdownHandler(() => this._peerManager.destroy());

    // Set up event routing
    (() => {
      this._peerManager.on(EVT_PEER_CONNECTED, zenRTCPeer => {
        // TODO: Remove
        console.log("zenRTCPeer connected", zenRTCPeer);

        // Start peer routing
        this._phantomPeerRouter.addChild(zenRTCPeer);

        // Start media stream routing
        this._mediaStreamRouter.addChild(zenRTCPeer);

        // Emit count to real server
        this._socketService.fetchSocketAPICall(
          SOCKET_API_ROUTE_SET_NETWORK_PARTICIPANT_COUNT,
          this._peerManager.getConnectedZenRTCPeers().length
        );

        // TODO: Re-emit
      });

      this._peerManager.on(EVT_PEER_DISCONNECTED, zenRTCPeer => {
        // TODO: Remove
        console.log("zenRTCPeer disconnected", zenRTCPeer);

        // Emit to other peers that this peer has disconnected
        this._phantomPeerRouter.handlePeerDisconnect(zenRTCPeer);

        // Emit count to real server
        this._socketService.fetchSocketAPICall(
          SOCKET_API_ROUTE_SET_NETWORK_PARTICIPANT_COUNT,
          this._peerManager.getConnectedZenRTCPeers().length
        );

        // TODO: Re-emit
      });

      this._peerManager.on(EVT_PEER_DESTROYED, zenRTCPeer => {
        // TODO: Remove
        console.log("zenRTCPeer destructed", zenRTCPeer);

        // TODO: Re-emit
      });

      this._peerManager.on(
        EVT_PEER_SHARED_STATE_UPDATED,
        ([zenRTCPeer, readOnlyUpdatedState]) => {
          // Send updated state to peer router
          this._phantomPeerRouter.handlePeerSharedStateUpdated(
            zenRTCPeer,
            readOnlyUpdatedState
          );

          // TODO: Re-emit
        }
      );

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

      this._peerManager.on(
        EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_ADDED,
        async ([zenRTCPeer, mediaStreamData]) => {
          // TODO: Remove
          console.log("zenRTCPeer added incoming media stream track", {
            zenRTCPeer,
            mediaStreamData,
          });

          const { mediaStreamTrack, mediaStream } = mediaStreamData;

          await this._mediaStreamRouter.addOutgoingMediaStreamTrack(
            zenRTCPeer,
            mediaStreamTrack,
            mediaStream
          );

          this._phantomPeerRouter.handlePeerIncomingMediaStreamsUpdated(
            zenRTCPeer
          );
        }
      );

      this._peerManager.on(
        EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
        async ([zenRTCPeer, mediaStreamData]) => {
          // TODO: Remove
          console.log("zenRTCPeer removed incoming media stream track", {
            zenRTCPeer,
            mediaStreamData,
          });

          const { mediaStreamTrack, mediaStream } = mediaStreamData;

          await this._mediaStreamRouter.removeOutgoingMediaStreamTrack(
            zenRTCPeer,
            mediaStreamTrack,
            mediaStream
          );

          this._phantomPeerRouter.handlePeerIncomingMediaStreamsUpdated(
            zenRTCPeer
          );
        }
      );
    })();
  }

  // TODO: Document
  _initSocketListener() {
    const socket = this._socket;

    // Listens for SOCKET_EVT_ZENRTC_SIGNAL on the socket connection and
    // determines if it should be routed to a relevant peer on this virtual
    // network
    const _handleFilterSocketZenRTCSignal = signal => {
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

        // TODO: Fix issue where an error is thrown if there is an await within
        // the connect sequence before the _webRTCPeer object is created within
        // ZenRTCPeer (perhaps listen to once connecting)

        zenRTCPeer.receiveZenRTCSignal(signal);
      }
    };

    socket.on(SOCKET_EVT_ZENRTC_SIGNAL, _handleFilterSocketZenRTCSignal);

    // Unbind from socket when destructed
    this.registerShutdownHandler(() =>
      socket.off(SOCKET_EVT_ZENRTC_SIGNAL, _handleFilterSocketZenRTCSignal)
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
