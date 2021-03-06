import UIServiceCore from "@core/classes/UIServiceCore";
import axios from "axios";

/**
 * Maintains internet connection information.
 */
export default class NetworkStatusMonitorService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Network Status Monitor Service");

    this.setState({
      isOnline: false,
      isFetchingIPInfo: false,
      data: null,
    });

    (() => {
      const _handleNetworkOnline = () => {
        this.setState({ isOnline: true });

        this.fetchIPInfo();
      };

      const _handleNetworkOffline = () => {
        this.setState({ isOnline: false, data: null });
      };

      this.addNativeEventListener("online", _handleNetworkOnline);

      this.addNativeEventListener("offline", _handleNetworkOffline);

      // Handle initial state
      if (navigator?.onLine) {
        _handleNetworkOnline();
      } else {
        _handleNetworkOffline();
      }
    })();
  }

  /**
   * Retrieves network IP info.
   *
   * @return {Promise<Object>} // TODO: Document structure
   */
  async fetchIPInfo() {
    this.setState({ isFetchingIPInfo: true });

    axios
      .get("https://www.cloudflare.com/cdn-cgi/trace")
      .then(resp => resp.data)
      .then(data => {
        const lines = Object.fromEntries(
          data
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
              let key = "";
              let value = "";

              let hasCompleteKey = false;

              for (let char of line) {
                if (char === "=") {
                  hasCompleteKey = true;
                } else if (!hasCompleteKey) {
                  key += char;
                } else {
                  value += char;
                }
              }

              return [key, value];
            })
        );

        // i.e.:
        /*
        colo: "MIA";
        fl: "363f162";
        gateway: "off";
        h: "www.cloudflare.com";
        http: "http/2";
        ip: "255.255.255.255";
        loc: "NI";
        sni: "plaintext";
        tls: "TLSv1.3";
        ts: "1652657757.97";
        uag: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36";
        visit_scheme: "https";
        warp: "off";
        */

        if (lines) {
          this.setState({ data: lines });
        }
      })
      .finally(() => this.setState({ isFetchingIPInfo: false }));
  }

  /**
   * Retrieves whether or not an IP info fetch is currently in progress.
   *
   * @return {boolean}
   */
  getIsFetchingIPInfo() {
    return this.getState().isFetchingIPInfo;
  }

  /**
   * Retrieves the online status of the browser.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
   *
   * @return {boolean}
   */
  getIsOnline() {
    return this.getState().isOnline;
  }

  /**
   * Retrieves the client IP address.
   *
   * @return {string}
   */
  getIPAddress() {
    return this.getState().data?.ip;
  }

  /**
   * Retrieves all of the IP info.
   *
   * @return {Object} // TODO: Document structure
   */
  getData() {
    return this.getState().data;
  }
}
