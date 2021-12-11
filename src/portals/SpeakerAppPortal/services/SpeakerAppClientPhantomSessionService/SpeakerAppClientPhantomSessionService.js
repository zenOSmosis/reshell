import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

import LocalPhantomPeerSyncObject from "./LocalPhantomPeerSyncObject";
import SyncObject from "sync-object";

import RemotePhantomPeerCollection from "./RemotePhantomPeerCollection";

export { EVT_UPDATED };

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

    // FIXME: (jh) Add collection as class property once implemented in PhantomCore
    // @see https://github.com/zenOSmosis/phantom-core/issues/102
    this.bindCollectionClass(RemotePhantomPeerCollection);

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

    // TODO: Handle user profile syncing, etc
    const writableSyncObject = new LocalPhantomPeerSyncObject({
      deviceAddress: localDeviceAddress,
    });

    const readOnlySyncObject = new SyncObject();

    (() => {
      const remotePhantomPeerCollection = this.getCollectionInstance(
        RemotePhantomPeerCollection
      );

      // TODO: RemotePhantomPeerSyncObject multiplexing, etc.
      // TODO: Refactor
      readOnlySyncObject.on(EVT_UPDATED, () => {
        const localSignalBrokerId = this.getState().localSignalBrokerId;

        const { peers } = readOnlySyncObject.getState();

        for (const signalBrokerId of Object.keys(peers)) {
          const peerState = peers[signalBrokerId];

          const isLocal = signalBrokerId === localSignalBrokerId;

          if (!isLocal) {
            remotePhantomPeerCollection.syncRemotePeerState(
              peerState,
              signalBrokerId
            );
          }
        }
      });

      readOnlySyncObject.registerShutdownHandler(() =>
        remotePhantomPeerCollection.destroyAllChildren()
      );

      // TODO: Remove or refactor
      remotePhantomPeerCollection.on(EVT_UPDATED, () => {
        console.log({
          remotePhantomPeers: remotePhantomPeerCollection.getChildren(),
        });
      });
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
