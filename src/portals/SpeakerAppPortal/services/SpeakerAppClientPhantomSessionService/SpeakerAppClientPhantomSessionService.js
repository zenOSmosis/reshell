import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

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

    // TODO: Use setInitialState / reset once https://github.com/zenOSmosis/phantom-core/issues/112 is implemented
    this._initialState = Object.freeze({
      isSessionActive: false,
      realmId: null,
      channelId: null,
      localZenRTCPeer: null,
      localSignalBrokerId: null,
    });

    this.setState(this._initialState);

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
  // IMPORTANT: This is called before the localZenRTCPeer is instantiated
  async initZenRTCPeerSyncObjects({ realmId, channelId }) {
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

    // Remove all PhantomPeers once read-only state is destructed
    readOnlySyncObject.registerShutdownHandler(() =>
      this._remotePhantomPeerCollection.destroyAllChildren()
    );

    // Set active state on next event tick
    setImmediate(() => {
      this.setState({ isSessionActive: true, realmId, channelId });
    });

    this._zenRTCPeerSyncObjects = {
      writableSyncObject,
      readOnlySyncObject,
    };

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

    (() => {
      // TODO: Split updates between remote profile updates
      // (readOnlySyncObject) and track updates (readOnlySyncObject /
      // localZenRTCPeerUpdates)
      const handleUpdate = async () => {
        console.log({
          localZenRTCPeer,
          readOnlySyncObject,
        });

        const allIncomingMediaStreams =
          localZenRTCPeer.getIncomingMediaStreams();

        const { peers } = readOnlySyncObject.getState();

        if (!peers) {
          return;
        }

        for (const signalBrokerId of Object.keys(peers)) {
          const peerState = peers[signalBrokerId];

          const isLocal = signalBrokerId === localSignalBrokerId;

          if (!isLocal) {
            await this._remotePhantomPeerCollection.syncRemotePeerState(
              peerState,
              signalBrokerId
            );

            const remotePhantomPeer =
              this._remotePhantomPeerCollection.getRemotePhantomPeerWithSignalBrokerId(
                signalBrokerId
              );

            if (remotePhantomPeer) {
              const mediaStreamTrackIds =
                remotePhantomPeer.getOutgoingMediaStreamIds();
              const mediaStreams = allIncomingMediaStreams.filter(mediaStream =>
                mediaStreamTrackIds.includes(mediaStream.id)
              );
              const mediaStreamTracks = mediaStreams
                .map(mediaStream => mediaStream.getTracks())
                .flat();

              // TODO: Remove
              console.log({ mediaStreams, mediaStreamTracks });

              // TODO: Map to remote peer
            }
          } else {
            // TODO: Map localZenRTCPeer outgoing tracks to local phantom peer
          }
        }
      };

      // TODO: RemotePhantomPeerSyncObject multiplexing, etc.
      // TODO: Refactor
      // TODO: Also update when localZenRTCPeer does
      this.proxyOn(readOnlySyncObject, EVT_UPDATED, handleUpdate);
      this.proxyOn(localZenRTCPeer, EVT_UPDATED, handleUpdate);
    })();
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
