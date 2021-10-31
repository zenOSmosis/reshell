import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import ZenRTCPeer from "../zenRTC/ZenRTCPeer";

export { EVT_UPDATED };

export default class SpeakerAppLocalZenRTCPeerService extends UIServiceCore {
  async connect() {
    const zenRTCPeer = new ZenRTCPeer();

    // TODO: Remove
    console.log({ zenRTCPeer });

    // TODO: Build out
  }
}
