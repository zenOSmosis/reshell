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
import SpeakerAppClientPhantomSessionService from "./SpeakerAppClientPhantomSessionService";
import InputMediaDevicesService from "@services/InputMediaDevicesService";
import OutputMediaDevicesService from "@services/OutputMediaDevicesService";
import ScreenCapturerService from "@services/ScreenCapturerService";
import UIModalService from "@services/UIModalService";

import UINotificationService from "@services/UINotificationService";

import InputDeviceSelectorModal from "@components/modals/InputDeviceSelectorModal";

import beep from "@utils/beep";

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

  // TODO: Provide ability to update LocalZenRTCPeer's LocalPhantomPeerSyncObject state, for example, to sync user profile, etc

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
    const { realmId, channelId } = network;

    // Destruct previous zenRTCPeer for this network, if exists
    await this.disconnect();

    const inputMediaDevicesService = this.useServiceClass(
      InputMediaDevicesService
    );

    // Fixes for possible no media streaming on iOS
    await (async () => {
      // IMPORTANT! This is necessary to jump-start the audio output on web
      // Safari if no input audio device is selected (does not resolve issue on
      // iOS 15 [and possibly >= 14])
      //
      // FIXME: (jh) This may not be necessary with the following step
      beep();

      // Determine if hardware media is being captured, and if not, present a
      // modal to ask for media (iOS might not play WebRTC audio if no hardware
      // device is being captured)
      if (!inputMediaDevicesService.getCaptureFactories().length) {
        await new Promise((resolve, reject) => {
          const uiModalService = this.useServiceClass(UIModalService);

          uiModalService.showModal(({ onCancel, ...rest }) => (
            <InputDeviceSelectorModal
              onDeviceCapture={resolve}
              onClose={reject}
              {...rest}
            />
          ));
        });
      }
    })();

    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    const screenCapturerService = this.useServiceClass(ScreenCapturerService);
    const networkService = this.useServiceClass(
      SpeakerAppNetworkDiscoveryService
    );

    const iceServers = await networkService.fetchICEServers();

    const ourSocket = socketService.getSocket();

    const phantomPeerService = this.useServiceClass(
      SpeakerAppClientPhantomSessionService
    );

    const { writableSyncObject, readOnlySyncObject } =
      await phantomPeerService.initZenRTCPeerSyncObject({ realmId, channelId });

    const localZenRTCPeer = new LocalZenRTCPeer({
      network,
      ourSocket,
      iceServers,
      writableSyncObject,
      readOnlySyncObject,
      inputMediaDevicesService,
      screenCapturerService,
    });

    const localSignalBrokerId = localZenRTCPeer.getSignalBrokerId();
    phantomPeerService.setLocalSignalBrokerId(localSignalBrokerId);

    localZenRTCPeer.registerShutdownHandler(() =>
      phantomPeerService.endZenRTCPeerSession()
    );

    this._localZenRTCPeer = localZenRTCPeer;

    // Handle event routing
    (() => {
      const outputMediaDevicesService = this.useServiceClass(
        OutputMediaDevicesService
      );

      // TODO: Use proxy on?
      localZenRTCPeer.on(EVT_CONNECTING, () => {
        this.setState({
          isConnecting: true,
          isConnected: false,
        });
      });

      // TODO: Use proxy on?
      localZenRTCPeer.on(EVT_CONNECTED, () => {
        this.setState({ isConnecting: false, isConnected: true });

        this.useServiceClass(UINotificationService).showNotification({
          title: "Connected to Network",
          body: `Connected to realm "${realmId}" / channel "${channelId}"`,
        });
      });

      // TODO: Use proxy on?
      localZenRTCPeer.on(EVT_DISCONNECTED, () => {
        this.setState({
          isConnecting: false,
          isConnected: false,
        });

        this.useServiceClass(UINotificationService).showNotification({
          title: "Disconnected from Network",
          body: `Disconnected from realm "${realmId}" / channel "${channelId}"`,
        });
      });

      // TODO: Use proxy on?
      localZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
        mediaStreamData => {
          const { mediaStreamTrack, mediaStream } = mediaStreamData;

          // Route to media stream output handler
          outputMediaDevicesService.addOutputMediaStreamTrack(
            mediaStreamTrack,
            mediaStream
          );
        }
      );

      // TODO: Use proxy on?
      localZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
        mediaStreamData => {
          const { mediaStreamTrack, mediaStream } = mediaStreamData;

          // Un-route from media stream output handler
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
