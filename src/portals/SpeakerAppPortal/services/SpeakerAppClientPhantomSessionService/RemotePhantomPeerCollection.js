import { PhantomCollection, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import RemotePhantomPeerSyncObject from "./RemotePhantomPeerSyncObject";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Document
export default class RemotePhantomPeerCollection extends PhantomCollection {
  // TODO: Document
  addChild(nextSyncState, remoteSignalBrokerId, localZenRTCPeer) {
    if (!nextSyncState) {
      console.warn(
        "No nextSyncState has been passed.  Did you mean to call removeChild() instead?"
      );
      return;
    }

    const prevChild = this.getChildWithKey(remoteSignalBrokerId);

    let nextChild =
      prevChild || new RemotePhantomPeerSyncObject(null, localZenRTCPeer);

    if (!prevChild) {
      super.addChild(nextChild, remoteSignalBrokerId);
    }

    nextChild.setState(nextSyncState);
  }

  // TODO: Document
  async syncRemotePeerState(
    nextSyncState,
    remoteSignalBrokerId,
    localZenRTCPeer
  ) {
    if (nextSyncState) {
      return this.addChild(
        nextSyncState,
        remoteSignalBrokerId,
        localZenRTCPeer
      );
    } else {
      const prevChild = this.getChildWithKey(remoteSignalBrokerId);

      if (prevChild) {
        await this.removeChild(prevChild);
      }
    }
  }

  /**
   * @param {string} remoteSignalBrokerId
   * @return {RemotePhantomPeerSyncObject | void}
   */
  getRemotePhantomPeerWithSignalBrokerId(remoteSignalBrokerId) {
    return this.getChildWithKey(remoteSignalBrokerId);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.destroyAllChildren();

    super.destroy();
  }
}
