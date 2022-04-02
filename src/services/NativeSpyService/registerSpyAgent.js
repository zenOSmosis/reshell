import { getClassName } from "phantom-core";

let spyAgents = [];

// TODO: Document
export default function registerSpyAgent(cb) {
  const spyAgent = cb();

  spyAgents = [...new Set([getClassName(spyAgent)])];
}

export { spyAgents };
