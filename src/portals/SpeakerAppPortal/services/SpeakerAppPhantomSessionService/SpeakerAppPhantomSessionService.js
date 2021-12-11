import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

import LocalPhantomPeerSyncObject from "./LocalPhantomPeerSyncObject";
// import RemotePhantomPeerSyncObject from "./RemotePhantomPeerSyncObject";
import SyncObject from "sync-object";

export { EVT_UPDATED };

// TODO: Document
export default class SpeakerAppPhantomSessionService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setState({
      isSessionActive: false,
      realmId: null,
      channelId: null,
    });

    this._zenRTCPeerSyncObjects = {};

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

    // TODO: RemotePhantomPeerSyncObject multiplexing, etc.
    readOnlySyncObject.on(EVT_UPDATED, () => {
      // TODO: Remove
      console.log({ readOnlySyncObject: readOnlySyncObject.getState() });
    });

    this._zenRTCPeerSyncObjects = {
      writableSyncObject,
      readOnlySyncObject,
    };

    this.setState({ isSessionActive: true, realmId, channelId });

    return this._zenRTCPeerSyncObjects;
  }

  // TODO: Document
  async endZenRTCPeerSession() {
    this.setState({ isSessionActive: false, realmId: null, channelId: null });

    await Promise.all(
      Object.values(this._zenRTCPeerSyncObjects).map(syncObject =>
        syncObject.destroy()
      )
    );

    this._zenRTCPeerSyncObjects = {};
  }
}
