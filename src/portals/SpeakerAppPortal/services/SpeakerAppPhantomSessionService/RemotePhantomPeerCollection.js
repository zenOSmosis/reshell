import { PhantomCollection, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import RemotePhantomPeerSyncObject from "./RemotePhantomPeerSyncObject";

export { EVT_UPDATED, EVT_DESTROYED };

export default class RemotePhantomPeerCollection extends PhantomCollection {
  // TODO: Document
  addChild(nextSyncState, remoteSignalBrokerId) {
    const prevChild = this.getChildWithKey(remoteSignalBrokerId);

    let nextChild = prevChild || new RemotePhantomPeerSyncObject();

    if (!prevChild) {
      super.addChild(nextChild, remoteSignalBrokerId);
    }

    nextChild.setState({ nextSyncState });
  }

  // TODO: Document
  syncRemotePeerState(nextSyncState, remoteSignalBrokerId) {
    return this.addChild(nextSyncState, remoteSignalBrokerId);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.destroyAllChildren();

    super.destroy();
  }
}
