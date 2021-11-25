import PhantomCore, { EVT_READY, EVT_DESTROYED } from "phantom-core";
import VirtualServerZenRTCPeerManager, {
  EVT_UPDATED,
  EVT_PEER_CONNECTED,
  EVT_PEER_DISCONNECTED,
  EVT_PEER_DESTROYED,
  EVT_PEER_UPDATED,
} from "./subClasses/VirtualServerZenRTCPeerManager";

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

    this._socketService = socketService;

    this._peerManager = new VirtualServerZenRTCPeerManager({
      realmId: this._realmId,
      channelId: this._channelId,
      deviceAddress: this._deviceAddress,
    });
    this.registerShutdownHandler(() => this._peerManager.destroy());

    this._init().catch(err => {
      this.log.error(err);

      this.destroy();
    });
  }

  // TODO: Document
  async _init() {
    // Start listening for socket events
    this._initSocketListener();

    // Tell the real server we're starting a session
    await this._emitSessionStart();
    // When destructed, tell the real server we're stopping the session
    this.registerShutdownHandler(() => this._emitSessionEnd());

    return super._init();
  }

  // TODO: Document
  _initSocketListener() {
    const socket = this._socketService.getSocket();

    // TODO: Refactor into signal broker?
    const _handleReceiveZenRTCSignal = signal => {
      // TODO: Remove
      console.log("TODO: _handleReceiveZenRTCSignal", signal);

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
        // TODO: Relay signal to appropriate peer
        /*
        const zenRTCPeer = this._getOrCreateVirtualServerZenRTCPeer(
          socketIdFrom,
          senderDeviceAddress,
          signalBrokerIdFrom
        );

        zenRTCPeer.receiveZenRTCSignal(signal);
        */
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
