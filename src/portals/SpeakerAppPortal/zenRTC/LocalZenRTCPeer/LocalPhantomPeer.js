import PhantomPeer from "../PhantomPeerCore";

/**
 * A virtual participant from the perspective of a web browser, or other
 * web-based client device.
 */
export default class LocalPhantomPeer extends PhantomPeer {
  constructor(socketId, rest = {}) {
    super(socketId, {
      mediaStreamTracks: [],
      mediaStreams: [],
      ...rest,
    });
  }
}
