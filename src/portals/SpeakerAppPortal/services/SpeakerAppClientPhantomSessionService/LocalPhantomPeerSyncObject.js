import PhantomPeerSyncObject, {
  EVT_UPDATED,
  EVT_DESTROYED,
  STATE_KEY_AVATAR_URL,
  STATE_KEY_NAME,
  STATE_KEY_DESCRIPTION,
  STATE_KEY_DETECTED_DEVICE,
  STATE_KEY_DEVICE_ADDRESS,
  STATE_KEY_IS_AUDIO_MUTED,
  STATE_KEY_MEDIA,
  STATE_KEY_IS_TYPING_CHAT_MESSAGE,
  STATE_KEY_LAST_CHAT_MESSAGE,
} from "@portals/SpeakerAppPortal/zenRTC/PhantomPeerSyncObject";

export {
  EVT_UPDATED,
  EVT_DESTROYED,
  STATE_KEY_AVATAR_URL,
  STATE_KEY_NAME,
  STATE_KEY_DESCRIPTION,
  STATE_KEY_DETECTED_DEVICE,
  STATE_KEY_DEVICE_ADDRESS,
  STATE_KEY_IS_AUDIO_MUTED,
  STATE_KEY_MEDIA,
  STATE_KEY_IS_TYPING_CHAT_MESSAGE,
  STATE_KEY_LAST_CHAT_MESSAGE,
};

/**
 * A virtual participant from the perspective of a web browser, or other
 * web-based client device.
 */
export default class LocalPhantomPeerSyncObject extends PhantomPeerSyncObject {}
