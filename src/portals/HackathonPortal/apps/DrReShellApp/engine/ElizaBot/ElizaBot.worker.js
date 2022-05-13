import { registerRPCMethod } from "@utils/classes/RPCPhantomWorker/worker";
import ElizaBot from "./ElizaBot";

const elizaBot = new ElizaBot();

registerRPCMethod("start", () => elizaBot.getInitial());
registerRPCMethod("reply", ({ text }) => elizaBot.transform(text));
registerRPCMethod("bye", () => elizaBot.getFinal());
