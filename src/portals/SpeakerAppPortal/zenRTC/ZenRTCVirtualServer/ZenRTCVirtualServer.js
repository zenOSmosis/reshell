import PhantomCore, { EVT_READY, EVT_DESTROYED } from "phantom-core";
import VirtualServerZenRTCPeerManager, {
  EVT_UPDATED,
  EVT_PEER_CONNECTED,
  EVT_PEER_DISCONNECTED,
  EVT_PEER_DESTROYED,
  EVT_PEER_UPDATED,
} from "./VirtualServerZenRTCPeerManager";

import { SOCKET_EVT_ZENRTC_SIGNAL } from "./VirtualServerZenRTCSignalBroker";

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

    // this._peerManager = new VirtualServerZenRTCPeerManager();

    this._init().catch(err => {
      this.log.error(err);

      this.destroy();
    });

    (() => {
      const socket = this._socketService.getSocket();

      const _handleReceiveZenRTCSignal = data => {
        // TODO: Remove
        console.log("TODO: _handleReceiveZenRTCSignal", data);

        /*
        const {
          socketIdFrom,
          senderDeviceAddress,
          signalBrokerIdFrom,
          realmId,
          channelId,
          signalBrokerIdTo,
        } = data;

        if (
          // IMPORTANT: Clients do not know the signalBrokerId they are sending
          // to, as the virtual server's signal broker isn't set up for that
          // client until the message is received
          signalBrokerIdTo === undefined &&
          realmId === this._realmId &&
          channelId === this._channelId
        ) {
          const zenRTCPeer = this._getOrCreateVirtualServerZenRTCPeer(
            socketIdFrom,
            senderDeviceAddress,
            signalBrokerIdFrom
          );

          zenRTCPeer.receiveZenRTCSignal(data);
        }
        */
      };

      socket.on(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveZenRTCSignal);

      this.registerShutdownHandler(() =>
        socket.off(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveZenRTCSignal)
      );
    })();
  }

  // TODO: Document
  async _init() {
    await this._emitSessionStart();

    return super._init();
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

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this._emitSessionEnd();

    return super.destroy();
  }
}
