import UIServiceCore, {
  EVT_UPDATE,
  EVT_DESTROY,
} from "@core/classes/UIServiceCore";

import { debounce } from "debounce";

import LocalZenRTCPeer from "../../zenRTC/LocalZenRTCPeer";

import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";
import SpeakerAppLocalUserProfileService, {
  STATE_KEY_AVATAR_URL as USER_PROFILE_STATE_KEY_AVATAR_URL,
  STATE_KEY_NAME as USER_PROFILE_STATE_KEY_NAME,
  STATE_KEY_DESCRIPTION as USER_PROFILE_STATE_KEY_DESCRIPTION,
} from "@portals/SpeakerAppPortal/services/SpeakerAppLocalUserProfileService";

import LocalPhantomPeerSyncObject, {
  STATE_KEY_DEVICE_ADDRESS as PHANTOM_PEER_STATE_KEY_DEVICE_ADDRESS,
  STATE_KEY_AVATAR_URL as PHANTOM_PEER_STATE_KEY_AVATAR_URL,
  STATE_KEY_NAME as PHANTOM_PEER_STATE_KEY_NAME,
  STATE_KEY_DESCRIPTION as PHANTOM_PEER_STATE_KEY_DESCRIPTION,
  STATE_KEY_IS_TYPING_CHAT_MESSAGE as PHANTOM_PEER_STATE_KEY_IS_TYPING_CHAT_MESSAGE,
  STATE_KEY_LAST_CHAT_MESSAGE as PHANTOM_PEER_STATE_KEY_LAST_CHAT_MESSAGE,
  STATE_KEY_IS_AUDIO_MUTED as PHANTOM_PEER_STATE_KEY_IS_AUDIO_MUTED,
} from "./LocalPhantomPeerSyncObject";
import SyncObject from "sync-object";

// TODO: Refactor this Easter egg
import UIModalService from "@services/UIModalService";
import Center from "@components/Center";
import SystemModal from "@components/modals/SystemModal";

// TODO: Refactor
import InputMediaDevicesService from "@services/InputMediaDevicesService";
import AppOrchestrationService from "@services/AppOrchestrationService";
import UINotificationService from "@services/UINotificationService";
import TextToSpeechService from "@services/TextToSpeechService";
import { REGISTRATION_ID as CHAT_REGISTRATION_ID } from "@portals/SpeakerAppPortal/apps/ChatApp";
import AppLinkButton from "@components/AppLinkButton";

import RemotePhantomPeerCollection from "./RemotePhantomPeerCollection";

export { EVT_UPDATE, EVT_DESTROY };

// TODO: Add events for when remote peers connect / disconnect; add UI notifications

// TODO: Document
export default class SpeakerAppClientPhantomSessionService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Client Phantom Session Service");

    // TODO: Use setInitialState / reset once https://github.com/zenOSmosis/phantom-core/issues/112 is implemented
    this._initialState = Object.freeze({
      isSessionActive: false,
      realmId: null,
      channelId: null,
      localZenRTCPeer: null,
      localSignalBrokerId: null,
      //
      chatMessages: [],
      chatMessagesHash: null,
    });

    this.setState(this._initialState);

    // NOTE: This will be dereferenced accordingly when the session ends
    this._zenRTCPeerSyncObjects = {};

    this._remotePhantomPeerCollection = this.bindCollectionClass(
      RemotePhantomPeerCollection
    );

    this.registerCleanupHandler(() => this.endZenRTCPeerSession());
  }

  /**
   * @return {string | null}
   */
  getRealmId() {
    return this.getState().realmId;
  }

  /**
   * @return {string | null}
   */
  getChannelId() {
    return this.getState().channelId;
  }

  /**
   * Alias for this.getWritableSyncObject().
   *
   * @return {LocalPhantomPeerSyncObject | void}
   */
  getLocalPhantomPeer() {
    return this.getWritableSyncObject();
  }

  /**
   * TODO: Document
   *
   * IMPORTANT: // NOTE: RemotePhantomPeers can contain the same device address
   * as the local user if the user is connected to the network with multiple
   * browser tabs.
   *
   * TODO: Import type
   * @return {RemotePhantomPeerSyncObject[]}
   */
  getRemotePhantomPeers() {
    return this._remotePhantomPeerCollection.getChildren();
  }

  /**
   * Retrieves all local and remote phantom peers.
   *
   * @return {PhantomPeerSyncObject[]}
   */
  getAllPhantomPeers() {
    return [this.getLocalPhantomPeer(), ...this.getRemotePhantomPeers()];
  }

  /**
   * Retrieves whether the current session is active or not.
   *
   * @return {boolean}
   */
  getIsSessionActive() {
    return this.getState().isSessionActive;
  }

  // TODO: Document
  // IMPORTANT: This is called before the localZenRTCPeer is instantiated
  async initZenRTCPeerSyncObjects({ realmId, channelId }) {
    await this.endZenRTCPeerSession();

    const localDeviceAddress = await this.useServiceClass(
      LocalDeviceIdentificationService
    ).fetchDeviceAddress();

    const writableSyncObject = new LocalPhantomPeerSyncObject({
      [PHANTOM_PEER_STATE_KEY_DEVICE_ADDRESS]: localDeviceAddress,
    });

    // Sync SpeakerAppLocalUserProfileService updates to PhantomPeerSyncObject
    (() => {
      const profileService = this.useServiceClass(
        SpeakerAppLocalUserProfileService
      );

      const syncProfile = () => {
        const {
          [USER_PROFILE_STATE_KEY_AVATAR_URL]: avatarURL,
          [USER_PROFILE_STATE_KEY_NAME]: name,
          [USER_PROFILE_STATE_KEY_DESCRIPTION]: description,
        } = profileService.getState();

        writableSyncObject.setState({
          [PHANTOM_PEER_STATE_KEY_AVATAR_URL]: avatarURL,
          [PHANTOM_PEER_STATE_KEY_NAME]: name,
          [PHANTOM_PEER_STATE_KEY_DESCRIPTION]: description,
        });
      };

      // Perform initial sync
      syncProfile();

      // Sync profile on service updates
      writableSyncObject.proxyOn(profileService, EVT_UPDATE, syncProfile);
    })();

    // Handle mute state broadcast
    (() => {
      const inputMediaDevicesService = this.useServiceClass(
        InputMediaDevicesService
      );

      const handleMediaDeviceUpdate = () => {
        const isMuted = inputMediaDevicesService.getIsAllAudioMuted();

        writableSyncObject.setState({
          [PHANTOM_PEER_STATE_KEY_IS_AUDIO_MUTED]: isMuted,
        });
      };

      // Perform initial sync
      handleMediaDeviceUpdate();

      // Sync profile on service updates
      writableSyncObject.proxyOn(
        inputMediaDevicesService,
        EVT_UPDATE,
        handleMediaDeviceUpdate
      );
    })();

    const readOnlySyncObject = new SyncObject();

    // Remove all PhantomPeers once read-only state is destructed
    readOnlySyncObject.registerCleanupHandler(() =>
      this._remotePhantomPeerCollection.destroyAllChildren()
    );

    this._zenRTCPeerSyncObjects = {
      writableSyncObject,
      readOnlySyncObject,
    };

    // Set active state on next event tick
    setImmediate(() => {
      this.setState({ isSessionActive: true, realmId, channelId });
    });

    return this._zenRTCPeerSyncObjects;
  }

  /**
   * @param {LocalZenRTCPeer} localZenRTCPeer
   */
  setLocalZenRTCPeer(localZenRTCPeer) {
    if (!(localZenRTCPeer instanceof LocalZenRTCPeer)) {
      throw new TypeError("localZenRTCPeer is not a LocalZenRTCPeer instance");
    }

    const localSignalBrokerId = localZenRTCPeer.getSignalBrokerId();

    this.setState({
      localSignalBrokerId,
      localZenRTCPeer,
    });

    const { readOnlySyncObject } = this._zenRTCPeerSyncObjects;

    // TODO: Refactor
    // Initialize / update Local/RemotePhantomPeerSyncObject instances
    (() => {
      // TODO: Split updates between remote profile updates
      // (readOnlySyncObject) and track updates (readOnlySyncObject /
      // localZenRTCPeerUpdates)
      const handleUpdate = debounce(
        async () => {
          // Fix issue where the following getState() might return null
          if (readOnlySyncObject.getIsDestroyed()) {
            return;
          }

          // TODO: Use constant values for destructed properties (use a common
          // constants file for this and the virtual server)
          const {
            peers,
            chatMessages = {},
            chatMessagesHash,
          } = readOnlySyncObject.getState();

          if (peers) {
            for (const signalBrokerId of Object.keys(peers)) {
              const peerState = peers[signalBrokerId];

              const isLocal = signalBrokerId === localSignalBrokerId;

              if (!isLocal) {
                await this._remotePhantomPeerCollection.syncRemotePeerState(
                  peerState,
                  signalBrokerId,
                  localZenRTCPeer
                );

                const remotePhantomPeer =
                  this._remotePhantomPeerCollection.getRemotePhantomPeerWithSignalBrokerId(
                    signalBrokerId
                  );

                if (remotePhantomPeer) {
                  // Emit EVT_UPDATE on remotePhantomPeer so that any track
                  // listeners can know to update
                  //
                  // NOTE: This also emits when localZenRTCPeer has updates (i.e.
                  // changed tracks, etc)
                  remotePhantomPeer.emit(EVT_UPDATE);
                }
              } else {
                // TODO: Map localZenRTCPeer outgoing tracks to local phantom peer
                // TODO: Emit EVT_UPDATE on localPhantomPeer
              }
            }
          }

          // Handle chat messages
          //
          // Only update chat state if chatMessagesHash has changed
          if (chatMessagesHash !== this.getState().chatMessagesHash) {
            // Cast to array [reversed] before setting as state
            const reversedChatMessages = Object.values(chatMessages)
              .map(chatMessage => {
                try {
                  return {
                    ...JSON.parse(chatMessage.json),
                    ...chatMessage,
                    json: undefined,
                  };
                } catch (err) {
                  console.error(err);

                  return null;
                }
              })
              // Reverse because the UI will render them in reverse order, plus
              // it makes it easier to retrieve the most recent message sent,
              // as it is the first in the array
              .reverse()
              // Filter out (and / or handle) messages which we don't want to
              // render in the chat thread
              .filter((message, idx) => {
                if (!message) {
                  return false;
                }

                // TODO: Refactor this Easter egg!!!
                if (message.body?.startsWith("/alert ")) {
                  if (idx === 0) {
                    const alertMessage = message.body.replace("/alert ", "");
                    const uiModalService = this.useServiceClass(UIModalService);
                    uiModalService.showModal(
                      ({ ...args }) => (
                        <SystemModal {...args}>
                          <Center>
                            <span style={{ fontSize: "2em" }}>
                              {alertMessage}
                            </span>
                          </Center>
                        </SystemModal>
                      ),
                      { duration: 5000 }
                    );
                    this.useServiceClass(TextToSpeechService).say(alertMessage);
                  }

                  // Don't render the easter egg in the chat message
                  return false;
                } else {
                  // Show the regular chat message
                  return true;
                }
              });

            this.setState({
              chatMessages: reversedChatMessages,
              chatMessagesHash,
            });

            // Handle UI notification for received messages
            const latestChatMessage = reversedChatMessages[0];
            if (latestChatMessage) {
              this._handleChatMessageReceivedUINotification(latestChatMessage);
            }
          }
        },
        100,
        // Debounce on trailing edge
        false
      );

      this.proxyOn(readOnlySyncObject, EVT_UPDATE, handleUpdate);
      this.proxyOn(localZenRTCPeer, EVT_UPDATE, handleUpdate);

      this.registerCleanupHandler(() => {
        handleUpdate.clear();
      });
    })();
  }

  /**
   * Determines if a UINotification should be generated for the latest chat
   * message, and if so generates one.
   *
   * @param {Object} latestChatMessage
   * @return {void}
   */
  _handleChatMessageReceivedUINotification(latestChatMessage) {
    const appOrchestrationService = this.useServiceClass(
      AppOrchestrationService
    );

    // Don't show if the chat program is the active one
    const activeAppRegistration =
      appOrchestrationService.getActiveAppRegistration();
    const activeAppRegistrationID = activeAppRegistration?.getID();
    if (activeAppRegistrationID === CHAT_REGISTRATION_ID) {
      return;
    }

    const localPhantomPeer = this.getLocalPhantomPeer();
    const localDeviceAddress = localPhantomPeer.getDeviceAddress();

    const remotePhantomPeer = this.getRemotePhantomPeers().find(pred => {
      const theirDeviceAddress = pred.getDeviceAddress();

      if (theirDeviceAddress === localDeviceAddress) {
        // Don't show notification if local user has multiple
        // browser tabs open
        return false;
      } else {
        // Remote peer device address matches message sender
        // address
        return theirDeviceAddress === latestChatMessage.senderAddress;
      }
    });

    if (remotePhantomPeer) {
      const isChatWindowOpen =
        appOrchestrationService.getIsAppRegistrationRunningWithID(
          CHAT_REGISTRATION_ID
        );

      this.useServiceClass(UINotificationService).showNotification({
        image: remotePhantomPeer.getAvatarURL(),
        title: remotePhantomPeer.getProfileName(),
        body: (
          <>
            {latestChatMessage.body}
            <div style={{ textAlign: "right", marginTop: 4 }}>
              <AppLinkButton
                id={CHAT_REGISTRATION_ID}
                title={isChatWindowOpen ? "Switch to Chat" : "Open Chat"}
              />
            </div>
          </>
        ),
        onClick: () =>
          appOrchestrationService.activateAppRegistrationWithID(
            CHAT_REGISTRATION_ID
          ),
      });
    }
  }

  // TODO: Document
  setIsTypingChatMessage(isTyping) {
    this.getWritableSyncObject().setState({
      [PHANTOM_PEER_STATE_KEY_IS_TYPING_CHAT_MESSAGE]: isTyping,
    });
  }

  // TODO: Document
  async sendChatMessage(chatMessageState) {
    this.getWritableSyncObject().setState({
      [PHANTOM_PEER_STATE_KEY_IS_TYPING_CHAT_MESSAGE]: false,
      [PHANTOM_PEER_STATE_KEY_LAST_CHAT_MESSAGE]: {
        // NOTE: Back-to-back messages with the same body content get filtered
        // out by diff algo in SyncObject, so they need to be encapsulated in
        // JSON
        // FIXME: (jh) Using the writable sync object for setting last chat
        // message isn't ideal because of this peculiarity but one of the pros
        // of using this method is that a message will be automatically chunked
        // if its size is greater than a single frame of a data channel can
        // handle
        json: JSON.stringify(chatMessageState),
      },
    });

    // TODO: Await confirmation of message received before resolving
  }

  // TODO: Document
  /**
   * @return {Object[]}
   */
  getChatMessages() {
    return this.getState().chatMessages;
  }

  /**
   * @return {SyncObject | void}
   */
  getWritableSyncObject() {
    return this._zenRTCPeerSyncObjects.writableSyncObject;
  }

  // TODO: Document
  async endZenRTCPeerSession() {
    // Reset state
    // TODO: Use reset method once https://github.com/zenOSmosis/phantom-core/issues/112 is implemented
    this.setState(this._initialState);

    // Destruct the attached sync objects
    await Promise.all(
      Object.values(this._zenRTCPeerSyncObjects).map(syncObject =>
        syncObject.destroy()
      )
    );

    this._zenRTCPeerSyncObjects = {};
  }
}
