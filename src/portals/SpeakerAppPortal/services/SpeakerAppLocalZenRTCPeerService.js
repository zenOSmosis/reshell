import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import LocalZenRTCPeer, {
  EVT_CONNECTING,
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
} from "../zenRTC/LocalZenRTCPeer";

import SpeakerAppNetworkDiscoveryService from "./SpeakerAppNetworkDiscoveryService";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";
import InputMediaDevicesService from "@services/InputMediaDevicesService";
import OutputMediaDevicesService from "@services/OutputMediaDevicesService";
import ScreenCapturerService from "@services/ScreenCapturerService";

export { EVT_UPDATED };

// TODO: Consider renaming to non-speaker-app for more dynamic usage
export default class SpeakerAppLocalZenRTCPeerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Local ZenRTC Peer Service");

    this.setState({
      isConnecting: false,
      isConnected: false,
    });

    this._localZenRTCPeer = null;
    this.registerShutdownHandler(() => this.disconnect());
  }

  // TODO: Document
  getIsConnecting() {
    return this.getState().isConnecting;
  }

  // TODO: Document
  getIsConnected() {
    return this.getState().isConnected;
  }

  // TODO: Document
  async connect(network) {
    // Destruct previous zenRTCPeer for this network, if exists
    await this.disconnect();

    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    const inputMediaDevicesService = this.useServiceClass(
      InputMediaDevicesService
    );

    const screenCapturerService = this.useServiceClass(ScreenCapturerService);
    const networkService = this.useServiceClass(
      SpeakerAppNetworkDiscoveryService
    );

    const iceServers = await networkService.fetchICEServers();

    const ourSocket = socketService.getSocket();

    const localZenRTCPeer = new LocalZenRTCPeer({
      network,
      ourSocket,
      iceServers,
      // writableSyncObject,
      // readOnlySyncObject,
      inputMediaDevicesService,
      screenCapturerService,
    });

    this._localZenRTCPeer = localZenRTCPeer;

    // Handle event routing
    (() => {
      const outputMediaDevicesService = this.useServiceClass(
        OutputMediaDevicesService
      );

      localZenRTCPeer.on(EVT_CONNECTING, () => {
        this.setState({ isConnecting: true, isConnected: false });
      });

      localZenRTCPeer.on(EVT_CONNECTED, () => {
        this.setState({ isConnecting: false, isConnected: true });
      });

      localZenRTCPeer.on(EVT_DISCONNECTED, () => {
        this.setState({ isConnecting: false, isConnected: false });
      });

      localZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
        mediaStreamData => {
          const { mediaStreamTrack, mediaStream } = mediaStreamData;

          outputMediaDevicesService.addOutputMediaStreamTrack(
            mediaStreamTrack,
            mediaStream
          );
        }
      );

      localZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
        mediaStreamData => {
          const { mediaStreamTrack, mediaStream } = mediaStreamData;

          outputMediaDevicesService.removeOutputMediaStreamTrack(
            mediaStreamTrack,
            mediaStream
          );
        }
      );
    })();

    return localZenRTCPeer.connect();
  }

  // TODO: Document
  async disconnect() {
    this._localZenRTCPeer?.destroy();
  }
}
