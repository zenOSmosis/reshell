import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import SpeakerAppNetworkService from "./SpeakerAppNetworkService";
// import ZenRTCPeer from "../zenRTC/ZenRTCPeer";

export { EVT_UPDATED };

export default class SpeakerAppLocalZenRTCPeerService extends UIServiceCore {
  constructor({ ...args }) {
    super({ ...args });

    // TODO: Fix issue where circular dependencies of services throw maximum callstack errors
  }

  async connect() {
    const networkService = this.useServiceClass(SpeakerAppNetworkService);

    const iceServers = await networkService.fetchICEServers();
    // const zenRTCPeer = new ZenRTCPeer();
    // TODO: Remove
    console.log({ iceServers });
    // TODO: Build out
  }
}
