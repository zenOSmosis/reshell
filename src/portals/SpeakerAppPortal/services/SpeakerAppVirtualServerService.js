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
    // @see https://github.com/zenOSmosis/phantom-core/issues/112
    this._initialState = Object.freeze({
      isHosting: false,
      realmId: null,
      channelId: null,
    });

    this.setState(this._initialState);
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

  // TODO: Add
  /**
   * @return {boolean}
   */
  /*
  getIsWebRTCSupported() {
    return VirtualServerZenRTCPeer.getIsWebRTCSupported();
  }
  */

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
    // TODO: Determine if WebRTC support is available before continuing
    /*
    if (!this.getIsWebRTCSupported()) {
      throw new Error("WebRTC is not supported in this browser");
    }
    */

    if (this._virtualServer) {
      throw new Error(
        "Virtual Server is currently in session. You may wish to call stopVirtualServer() instead."
      );
    }

    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    const deviceAddress = await this.useServiceClass(
      LocalDeviceIdentificationService
    ).fetchDeviceAddress();

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

    this._virtualServer.registerCleanupHandler(async () => {
      // TODO: Use reset method once available
      // @see https://github.com/zenOSmosis/phantom-core/issues/112
      this.setState(this._initialState);
      this._virtualServer = null;

      this.useServiceClass(UINotificationService).showNotification({
        title: "Stopped hosting",
        body: `Stopped hosting realm "${realmId}" / channel "${channelId}"`,
      });
    });

    await this._virtualServer.onceReady();

    this.setState({ isHosting: true, realmId, channelId });

    this.useServiceClass(UINotificationService).showNotification({
      title: "You are now hosting",
      body: `Hosting realm "${realmId}" / channel "${channelId}"`,
    });
  }

  /**
   * Retrieves number of seconds the virtual server has been running, or 0 if
   * it is not running.
   *
   * @return {number}
   */
  getVirtualServerUptime() {
    return this.getIsHosting() && this._virtualServer
      ? this._virtualServer.getInstanceUptime()
      : 0;
  }

  // TODO: Document
  // TODO: Wire up to virtualServer
  async stopVirtualServer() {
    return this._virtualServer.destroy();
  }
}
