import { EVT_READY } from "phantom-core";

/** @type {Map<string, Function>} */
const rpcMethodMap = new Map();

/**
 * Registers a callback handler to be invoked when an RPC method is requested.
 *
 * @param {string} method
 * @param {Function} handler
 * @return {void}
 */
export function registerRPCMethod(method, handler) {
  if (rpcMethodMap.get(method)) {
    throw new Error(
      `rpcMethodMap already has a handler for method: "${method}"`
    );
  }

  rpcMethodMap.set(method, handler);
}

/**
 * Listens for messages from host process.
 *
 * Loosely based on JSON-RPC.
 *
 * @see https://en.wikipedia.org/wiki/JSON-RPC
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel/message_event
 *
 * @param {MessageEvent} evt
 * @return {Promise<void>}
 */
global.addEventListener("message", async evt => {
  const { method, params, id } = evt.data;

  const handler = rpcMethodMap.get(method);

  if (handler) {
    try {
      const result = await handler(params);

      // TODO: Ensure same origin
      global.postMessage({ id, method, result });
    } catch (error) {
      global.postMessage({ id, method, error });
    }
  }
});

// Emit that we're ready
global.postMessage(EVT_READY);
