import ElizaBot from "./ElizaBot";

export default class ElizaBotController extends ElizaBot {
  start() {
    return this.getInitial();
  }

  reply(text) {
    return this.transform(text);
  }

  bye() {
    return this.getFinal();
  }
}
