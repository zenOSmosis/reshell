const rpcMethodMap = new Map();

/**
 * Registers a callback handler to be invoked when an RPC method is requested.
 *
 * @param {string} method
 * @param {Function} handler
 */
export function registerRPCMethod(method, handler) {
  if (rpcMethodMap.get(method)) {
    throw new Error(
      `rpcMethodMap already has a handler for method: "${method}"`
    );
  }

  rpcMethodMap.set(method, handler);
}

// TODO: Document
global.addEventListener("message", async evt => {
  const { method, params, id } = evt.data;

  const handler = rpcMethodMap.get(method);

  if (handler) {
    try {
      const result = await handler(params);

      // TODO: Emulate JSON-RPC w/o non-essential data
      // TODO: Ensure same origin
      global.postMessage({ id, method, result });
    } catch (error) {
      global.postMessage({ id, method, error });
    }
  }
});
