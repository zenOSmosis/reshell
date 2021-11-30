import UIServiceCore from "@core/classes/UIServiceCore";
import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";
import SpeakerAppNetworkDiscoveryService from "./SpeakerAppNetworkDiscoveryService";
import ZenRTCVirtualServer from "../zenRTC/ZenRTCVirtualServer";

import UINotificationService from "@services/UINotificationService";

// TODO: Document (used for network hosting)

// TODO: Document
export default class SpeakerAppVirtualServerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Virtual Server Service");

    this._virtualServer = null;

    // TODO: Migrate to setInitialState once available
    this.setState({
      isHosting: false,
      realmId: null,
      channelId: null,
    });
  }

  // TODO: Document
  getIsHosting() {
    return this.getState().isHosting;
  }

  // TODO: Document
  getNetworkRoute() {
    const { realmId, channelId } = this.getState();

    return {
      realmId,
      channelId,
    };
  }

  // TODO: Document
  async createVirtualServer({
    realmId,
    channelId,
    networkName,
    networkDescription,
    isPublic,

    // TODO: Obtain buildHash and userAgent internally
    buildHash,
    userAgent,
  }) {
    if (this._virtualServer) {
      throw new Error(
        "Virtual Server is currently in session. You may wish to call stopVirtualServer() instead."
      );
    }

    // TODO: Init multi-peer manager here
    // TODO: Adjust params with some sort of parameter in order for remote peer's "LocalZenRTCSignalBroker" to be able to reach this network host
    // const socket = this._socketService.getSocket();

    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    const deviceAddress = await this.useServiceClass(
      LocalDeviceIdentificationService
    ).fetchLocalAddress();

    const iceServers = await this.useServiceClass(
      SpeakerAppNetworkDiscoveryService
    ).fetchICEServers();

    this._virtualServer = new ZenRTCVirtualServer({
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
    });

    this._virtualServer.registerShutdownHandler(async () => {
      await this.stopVirtualServer();

      this.setState({ isHosting: false, realmId: null, channelId: null });
      this._virtualServer = null;

      this.useServiceClass(UINotificationService).showNotification({
        title: "Stopped hosting",
        body: `Stopped hosting realm "${realmId}" / channel "${channelId}"`,
      });
    });

    await this._virtualServer.onceReady();

    this.setState({ isHosting: true, realmId: realmId, channelId: channelId });

    this.useServiceClass(UINotificationService).showNotification({
      title: "You are now hosting",
      body: `Hosting realm "${realmId}" / channel "${channelId}"`,
    });
  }

  // TODO: Document
  // TODO: Wire up to virtualServer
  async stopVirtualServer() {
    return this._virtualServer.destroy();
  }
}
