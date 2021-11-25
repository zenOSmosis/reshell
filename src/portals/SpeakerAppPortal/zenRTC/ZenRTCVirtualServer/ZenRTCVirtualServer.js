import PhantomCore, { EVT_READY, EVT_DESTROYED } from "phantom-core";
import VirtualServerZenRTCPeerManager, {
  EVT_PEER_CONNECTED,
  EVT_PEER_DISCONNECTED,
  EVT_PEER_DESTROYED,
  EVT_PEER_UPDATED,
} from "./subClasses/VirtualServerZenRTCPeerManager";

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
      backgroundImage: null,

      peers: {},

      networkData: {},

      chatMessages: {},
    });

    this._socketService = socketService;
    this._socket = socketService.getSocket();

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
      // TODO: Remove
      console.log("zenRTCPeer connected", zenRTCPeer);
    });

    this._peerManager.on(EVT_PEER_DISCONNECTED, zenRTCPeer => {
      // TODO: Remove
      console.log("zenRTCPeer disconnected", zenRTCPeer);
    });

    this._peerManager.on(EVT_PEER_UPDATED, zenRTCPeer => {
      // TODO: Remove
      console.log("zenRTCPeer updated", zenRTCPeer);
    });

    this._peerManager.on(EVT_PEER_DESTROYED, zenRTCPeer => {
      // TODO: Remove
      console.log("zenRTCPeer destructed", zenRTCPeer);
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
