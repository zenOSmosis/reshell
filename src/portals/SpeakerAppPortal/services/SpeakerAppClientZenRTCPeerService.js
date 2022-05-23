import UIServiceCore, { EVT_UPDATE } from "@core/classes/UIServiceCore";
import LocalZenRTCPeer, {
  EVT_CONNECTING,
  EVT_CONNECT,
  EVT_DISCONNECT,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADD,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVE,
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

export { EVT_UPDATE };

// FIXME: (jh) Consider renaming to non-speaker-app for more dynamic usage
export default class SpeakerAppClientZenRTCPeerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Client ZenRTC Peer Service");

    this.setState({
      isConnecting: false,
      isConnected: false,
    });

    this._localZenRTCPeer = null;
    this.registerCleanupHandler(() => this.disconnect());
  }

  /**
   * Retrieves the currently connecting state.
   *
   * @return {boolean}
   */
  getIsConnecting() {
    return this.getState().isConnecting;
  }

  /**
   * Retrieves the currently connected state.
   *
   * @return {boolean}
   */
  getIsConnected() {
    return this.getState().isConnected;
  }

  /**
   * Retrieves whether or not the browser supports WebRTC.
   *
   * @return {boolean}
   */
  getIsWebRTCSupported() {
    return LocalZenRTCPeer.getIsWebRTCSupported();
  }

  // TODO: Document
  async connect(network) {
    if (!this.getIsWebRTCSupported()) {
      throw new Error("WebRTC is not supported in this browser");
    }

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
        // TODO: Replace w/ InputMediaDeviceUIModalService handler
        await new Promise((resolve, reject) => {
          const uiModalService = this.useServiceClass(UIModalService);

          uiModalService.showModal(({ ...rest }) => (
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
      await phantomPeerService.initZenRTCPeerSyncObjects({
        realmId,
        channelId,
      });

    const localZenRTCPeer = new LocalZenRTCPeer({
      network,
      ourSocket,
      iceServers,
      writableSyncObject,
      readOnlySyncObject,
      inputMediaDevicesService,
      screenCapturerService,
    });

    // Register the localZenRTCPeer with the phantomPeerService
    phantomPeerService.setLocalZenRTCPeer(localZenRTCPeer);

    localZenRTCPeer.registerCleanupHandler(() =>
      phantomPeerService.endZenRTCPeerSession()
    );

    this._localZenRTCPeer = localZenRTCPeer;

    // Handle event routing
    (() => {
      const outputMediaDevicesService = this.useServiceClass(
        OutputMediaDevicesService
      );

      const _handleSetIsConnectingState = () => {
        this.setState({
          isConnecting: true,
          isConnected: false,
        });
      };

      this.proxyOn(localZenRTCPeer, EVT_CONNECTING, async () => {
        if (!socketService.getIsConnected()) {
          // Show UI notification
          this.useServiceClass(UINotificationService).showNotification({
            title: "Lost network connectivity",
            body: `Lost connection to realm "${realmId}" / channel "${channelId}"`,
          });

          _handleSetIsConnectingState();
        } else {
          const isSpeakerAppNetworkOnline =
            await networkService.fetchIsNetworkOnline({ realmId, channelId });

          if (!isSpeakerAppNetworkOnline) {
            // Show UI notification
            this.useServiceClass(UINotificationService).showNotification({
              title: "Speaker.app Network Offline",
              body: `Lost connection to realm "${realmId}" / channel "${channelId}"`,
            });

            localZenRTCPeer.destroy();
          } else {
            _handleSetIsConnectingState();
          }
        }
      });

      this.proxyOn(localZenRTCPeer, EVT_CONNECT, () => {
        this.setState({ isConnecting: false, isConnected: true });

        // Show UI notification
        this.useServiceClass(UINotificationService).showNotification({
          title: "Connected to Network",
          body: `Connected to realm "${realmId}" / channel "${channelId}"`,
        });
      });

      this.proxyOn(localZenRTCPeer, EVT_DISCONNECT, () => {
        this.setState({
          isConnecting: false,
          isConnected: false,
        });

        // Show UI notification
        this.useServiceClass(UINotificationService).showNotification({
          title: "Disconnected from Network",
          body: `Disconnected from realm "${realmId}" / channel "${channelId}"`,
        });
      });

      this.proxyOn(
        localZenRTCPeer,
        EVT_INCOMING_MEDIA_STREAM_TRACK_ADD,
        mediaStreamData => {
          const { mediaStreamTrack, mediaStream } = mediaStreamData;

          // Route to media stream output handler
          outputMediaDevicesService.addOutputMediaStreamTrack(
            mediaStreamTrack,
            mediaStream
          );
        }
      );

      this.proxyOn(
        localZenRTCPeer,
        EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVE,
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

  /**
   * Retrieves number of seconds since the WebRTC connection was made,
   * returning 0 if no connection is present.
   *
   * @return {number}
   **/
  getConnectionUptime() {
    return this._localZenRTCPeer?.getConnectionUptime() || 0;
  }

  /**
   * Disconnects from the ZenRTC session.
   *
   * @return {Promise<void>}
   */
  async disconnect() {
    return this._localZenRTCPeer?.destroy();
  }
}
