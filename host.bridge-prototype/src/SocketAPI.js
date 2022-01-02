import PhantomCore, { EVT_DESTROYED } from "phantom-core";

export { EVT_DESTROYED };

// TODO: Implement support for SocketChannel: https://github.com/zenOSmosis/js-shell/blob/master/backend/src/utils/socketAPI/SocketChannel.js

// TODO: Rename to SocketAPIServer
// IMPORTANT: This should be treated as a singleton (@link https://github.com/zenOSmosis/phantom-core/issues/72)
// TODO: Document
export default class SocketAPI extends PhantomCore {
  constructor(io, socket) {
    super();

    this._io = io;
    this._socket = socket;

    this.log(`Starting up SocketAPI for socket: ${this._socket.id}`);

    this._socket.on("disconnect", () => {
      this.log(`Shutting down SocketAPI for socket: ${this._socket.id}`);

      this.destroy();
    });
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // TODO: Should we really disconnect here, or just unbind the bound routes?
    this._socket.disconnect();

    return super.destroy();
  }

  // TODO: Document
  getSocket() {
    return this._socket;
  }

  // TODO: Implement removeRoute?

  // TODO: Document
  addRoute(routeName, routeHandler) {
    this._socket.on(routeName, async (clientArgs = {}, ack) => {
      this.log(
        `Executing route name "${routeName}" for socket: ${this._socket.id}`
      );

      // ++_taskNumberIdx;

      // ++totalRunningTasks;

      // Fix issue where same _taskNumberIdx was reported for concurrent tasks
      // const taskNumber = _taskNumberIdx;

      if (!ack) {
        ack = () => null;
      }

      let error = null;
      let resp = null;

      try {
        /*
        console.log(
          `"${this._socket.id}" SocketAPI task ${taskNumber} (${routeName}) started [${totalRunningTasks} concurrent]`
        );
        */

        // Run the task associated w/ the API route
        resp = await routeHandler(clientArgs, {
          io: this._io,
          socket: this._socket,
        });
      } catch (err) {
        console.error(err);

        error = err;
      } finally {
        // Basic error serialization
        //
        // Note: There is also this library https://www.npmjs.com/package/serialize-error
        // but I don't think it should be used here
        const errMessage = !error
          ? null
          : error && error.message
          ? error.message
          : error;

        // Response w/ tuple-like, [error, response] signature
        ack([errMessage, resp]);

        // TODO: Measure time spent performing task?
        // @see https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_measurement_apis

        // Deincrement total running tasks because this task has ended
        // --totalRunningTasks;

        /*
        console[!errMessage ? "log" : "error"](
          `"${socket.id}" SocketAPI task ${taskNumber} (${routeName}) ended ${
            !errMessage ? "successfully" : "unsuccessfully"
          } [${totalRunningTasks} concurrent]`
        );
        */
      }
    });
  }

  // TODO: Implement removeRoute?
}
