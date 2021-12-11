import { PhantomCollection, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import RemotePhantomPeerSyncObject from "./RemotePhantomPeerSyncObject";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Document
export default class RemotePhantomPeerCollection extends PhantomCollection {
  // TODO: Document
  addChild(nextSyncState, remoteSignalBrokerId) {
    if (!nextSyncState) {
      console.warn(
        "No nextSyncState has been passed.  Did you mean to call removeChild() instead?"
      );
      return;
    }

    const prevChild = this.getChildWithKey(remoteSignalBrokerId);

    let nextChild = prevChild || new RemotePhantomPeerSyncObject();

    if (!prevChild) {
      super.addChild(nextChild, remoteSignalBrokerId);
    }

    nextChild.setState(nextSyncState);
  }

  // TODO: Document
  syncRemotePeerState(nextSyncState, remoteSignalBrokerId) {
    if (nextSyncState) {
      return this.addChild(nextSyncState, remoteSignalBrokerId);
    } else {
      const prevChild = this.getChildWithKey(remoteSignalBrokerId);

      if (prevChild) {
        this.removeChild(prevChild);
      }
    }
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.destroyAllChildren();

    super.destroy();
  }
}
