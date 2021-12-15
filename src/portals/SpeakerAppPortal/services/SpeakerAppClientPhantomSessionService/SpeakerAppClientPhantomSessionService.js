import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

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
} from "./LocalPhantomPeerSyncObject";
import SyncObject from "sync-object";

import RemotePhantomPeerCollection from "./RemotePhantomPeerCollection";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Add events for when remote peers connect / disconnect; add UI notifications

// TODO: Document
export default class SpeakerAppClientPhantomSessionService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Client Phantom Session Service");

    this.setState({
      isSessionActive: false,
      realmId: null,
      channelId: null,
      localSignalBrokerId: null,
    });

    this._zenRTCPeerSyncObjects = {};

    this._remotePhantomPeerCollection = this.bindCollectionClass(
      RemotePhantomPeerCollection
    );

    this.registerShutdownHandler(() => this.endZenRTCPeerSession());
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
   * TODO: Import type and document further
   * @return {RemotePhantomPeerSyncObject[]}
   */
  getRemotePhantomPeers() {
    return this._remotePhantomPeerCollection.getChildren();
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
  setLocalSignalBrokerId(localSignalBrokerId) {
    this.setState({ localSignalBrokerId });
  }

  // TODO: Document
  async initZenRTCPeerSyncObject({ realmId, channelId }) {
    await this.endZenRTCPeerSession();

    const localDeviceAddress = await this.useServiceClass(
      LocalDeviceIdentificationService
    ).fetchDeviceAddress();

    const writableSyncObject = new LocalPhantomPeerSyncObject({
      [PHANTOM_PEER_STATE_KEY_DEVICE_ADDRESS]: localDeviceAddress,
    });

    // Map SpeakerAppLocalUserProfileService updates to LocalPhantomPeerSyncObject
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
      writableSyncObject.proxyOn(profileService, EVT_UPDATED, syncProfile);
    })();

    const readOnlySyncObject = new SyncObject();

    (() => {
      // TODO: RemotePhantomPeerSyncObject multiplexing, etc.
      // TODO: Refactor
      readOnlySyncObject.on(EVT_UPDATED, () => {
        const localSignalBrokerId = this.getState().localSignalBrokerId;

        const { peers } = readOnlySyncObject.getState();

        for (const signalBrokerId of Object.keys(peers)) {
          const peerState = peers[signalBrokerId];

          const isLocal = signalBrokerId === localSignalBrokerId;

          if (!isLocal) {
            this._remotePhantomPeerCollection.syncRemotePeerState(
              peerState,
              signalBrokerId
            );
          }
        }
      });

      // Remove all PhantomPeers once read-only state is destructed
      readOnlySyncObject.registerShutdownHandler(() =>
        this._remotePhantomPeerCollection.destroyAllChildren()
      );
    })();

    this._zenRTCPeerSyncObjects = {
      writableSyncObject,
      readOnlySyncObject,
    };

    this.setState({ isSessionActive: true, realmId, channelId });

    return this._zenRTCPeerSyncObjects;
  }

  // TODO: Document
  async endZenRTCPeerSession() {
    this.setState({
      isSessionActive: false,
      realmId: null,
      channelId: null,
      localSignalBrokerId: null,
    });

    await Promise.all(
      Object.values(this._zenRTCPeerSyncObjects).map(syncObject =>
        syncObject.destroy()
      )
    );

    this._zenRTCPeerSyncObjects = {};
  }
}
