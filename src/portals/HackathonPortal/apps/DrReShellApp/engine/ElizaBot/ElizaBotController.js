import RPCPhantomWorker from "@utils/classes/RPCPhantomWorker/main";

/**
 * Note: A primary reason for running this bot in a worker fixes a bug where
 * starting a new instance would cause the bot to say "I don't know what to
 * say" rather often.
 */
export default class ElizaBotController extends RPCPhantomWorker {
  constructor() {
    super(() => new Worker("./ElizaBot.worker", { type: "module" }));
  }

  /**
   * Requests a welcome message.
   *
   * Note: This can be called multiple times without side-effects.
   *
   * @return {Promise<string>}
   */
  async start() {
    return this.call("start");
  }

  /**
   * Requests a reply.
   *
   * @return {Promise<string>}
   */
  async reply(text) {
    return this.call("reply", { text });
  }

  /**
   * Requests a goodbye message.
   *
   * Note: This can be called multiple times without side-effects.
   *
   * @return {Promise<string>}
   */
  async bye() {
    return this.call("bye");
  }
}
