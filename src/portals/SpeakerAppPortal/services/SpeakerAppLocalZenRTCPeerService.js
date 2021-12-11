import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import LocalZenRTCPeer, {
  EVT_CONNECTING,
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
} from "../zenRTC/LocalZenRTCPeer";

import SyncObject from "sync-object";

import SpeakerAppNetworkDiscoveryService from "./SpeakerAppNetworkDiscoveryService";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";
import SpeakerAppPhantomPeerService from "./SpeakerAppPhantomPeerService";
import InputMediaDevicesService from "@services/InputMediaDevicesService";
import OutputMediaDevicesService from "@services/OutputMediaDevicesService";
import ScreenCapturerService from "@services/ScreenCapturerService";
import UIModalService from "@services/UIModalService";
import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

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
      realmId: null,
      channelId: null,
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
  getRealmId() {
    return this.getState().realmId;
  }

  // TODO: Document
  getChannelId() {
    return this.getState().channelId;
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

    // Contains read-only state, sent from the remote peer
    const readOnlySyncObject = new SyncObject();

    const localDeviceAddress = await this.useServiceClass(
      LocalDeviceIdentificationService
    ).fetchDeviceAddress();

    const localZenRTCPeer = new LocalZenRTCPeer({
      network,
      localDeviceAddress,
      ourSocket,
      iceServers,
      readOnlySyncObject,
      inputMediaDevicesService,
      screenCapturerService,
    });

    // TODO: Handle
    const localPhantomPeerSyncObject =
      localZenRTCPeer.getLocalPhantomPeerSyncObject();

    // TODO: Remove
    console.log({
      localPhantomPeerSyncObject,
    });

    // TODO: Remove
    console.warn("local signal broker id", localZenRTCPeer.getSignalBrokerId());

    // Handle PhantomPeer servicing
    (() => {
      const phantomPeerService = this.useServiceClass(
        SpeakerAppPhantomPeerService
      );

      readOnlySyncObject.on(EVT_UPDATED, () => {
        phantomPeerService.handleUpdatedPhantomPeerState(
          readOnlySyncObject.getState().peers
        );
      });

      this.proxyOn(localZenRTCPeer, EVT_DISCONNECTED, () => {
        phantomPeerService.clear();
      });
    })();

    // TODO: Remove
    (() => {
      const writableSyncObject = localZenRTCPeer.getWritableSyncObject();
      writableSyncObject.on(EVT_UPDATED, () => {
        // TODO: Remove
        console.log({ writableSyncObject: writableSyncObject.getState() });
      });
    })();

    localZenRTCPeer.registerShutdownHandler(() => readOnlySyncObject.destroy());

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
          realmId,
          channelId,
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
          realmId: null,
          channelId: null,
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
