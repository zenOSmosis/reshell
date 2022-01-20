import SyncObject, { EVT_UPDATED, EVT_DESTROYED } from "sync-object";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export { EVT_UPDATED, EVT_DESTROYED };

const INITIAL_BODY_STATE = "";

// TODO: Document (primarily for local chat messages)
export default class LocalChatMessageState extends SyncObject {
  /**
   * @param {Object} initialState? [default = {}]
   */
  constructor(initialState = {}) {
    const DEFAULT_STATE = Object.freeze({
      id: initialState.id || uuidv4(),

      // ISO 8601 string
      // TODO: Rename?
      createDate: initialState.createDate || dayjs().toISOString(),

      body: INITIAL_BODY_STATE,
      isTyping: false,
    });

    super({ ...DEFAULT_STATE, ...initialState });

    this._typingTimeout = null;
    this.registerShutdownHandler(() => {
      clearTimeout(this._typingTimeout);
    });

    const { id: messageId } = this.getState();
    this._messageId = messageId;
  }

  /**
   * @return {string} The message id which all participants in the network can
   * reference the message.
   */
  getId() {
    return this._messageId;
  }

  /**
   * @return {string}
   */
  getBody() {
    return this.getState().body;
  }

  // TODO: Document
  setBody(body) {
    return this.setState({ body });
  }

  // TODO: Document
  resetBody() {
    return this.setState({ body: INITIAL_BODY_STATE });
  }

  // TODO: Document
  setIsTyping(isTyping) {
    this.setState({ isTyping });
  }

  // TODO: Document
  getIsTyping() {
    return this.getState().isTyping;
  }

  // TODO: Document
  setState(updatedState) {
    if (updatedState.isTyping) {
      clearTimeout(this._typingTimeout);
      this._typingTimeout = setTimeout(() => {
        this.setState({ isTyping: false });
      }, 2000);
    }

    super.setState(updatedState);
  }

  // TODO: Document
  getPublishableState() {
    const copiedState = { ...this.getState() };
    delete copiedState.isTyping;

    return copiedState;
  }
}
