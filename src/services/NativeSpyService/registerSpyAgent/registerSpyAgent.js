import SpyAgent from "./SpyAgent";

const nativeSpies = [];

// TODO: Fix invalid type
/**
 * @callback registerSpyAgentCallback
 * @param {SpyAgent.createSpyAgentSignature} createSpyAgentSignature
 */

/**
 * Registers a higher-order function to track usage of lower-level APIs.
 *
 * TODO: Document params
 */
export default function registerSpyAgent(spiesOn, initialState, initFn) {
  if (nativeSpies.includes(spiesOn)) {
    throw new Error("Cannot add duplicate native spy");
  }

  nativeSpies.push(spiesOn);

  const signature = SpyAgent.createSpyAgentSignature(spiesOn, initialState);

  initFn(signature);
}

export { nativeSpies };
