import SocketIOService, {
  EVT_CONNECTED,
  EVT_DISCONNECTED,
} from "@services/SocketIOService";
import {
  sendCachedAuthorization,
  getMergedAuthorization,
} from "@portals/SpeakerAppPortal/shared/adapters/serviceAuthorization/client";
import { SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED } from "@portals/SpeakerAppPortal/shared/socketEvents";
import { KEY_SERVICE_AUTHORIZATION } from "@portals/SpeakerAppPortal/local/localStorageKeys";
import KeyVaultService from "@services/KeyVaultService";

export { EVT_CONNECTED, EVT_DISCONNECTED };

// TODO: Look into WebAuthn: https://webauthn.guide / https://dev.to/jsombie/say-goodbye-to-passwords-webauthn-the-foundations-27g7

// TODO: Clean up
/*
import { useEffect, useState } from "react";
import io from "socket.io-client";
import SocketAPIClient from "@portals/SpeakerAppPortal/shared/SocketAPIClient";
*/

/*
import { KEY_SERVICE_AUTHORIZATION } from "@portals/SpeakerAppPortal/local/localStorageKeys";
import { EVT_CONNECT_ERROR } from "./socketConstants";
*/

// import useLocalStorage from "@portals/SpeakerAppPortal/hooks/useLocalStorage";

const CLIENT_BUILD_HASH = process.env.REACT_APP_GIT_HASH;

export default class SpeakerAppSocketAuthenticationService extends SocketIOService {
  constructor({ ...args }) {
    super({ ...args });

    // Automatically connect
    this.connect();
  }

  // TODO: Document
  async fetchCachedAuthorization() {
    const cachedAuthorization = await this.useServiceClass(KeyVaultService)
      .getLocalStorageEngine()
      .fetchItem(KEY_SERVICE_AUTHORIZATION);

    if (cachedAuthorization) {
      return JSON.parse(cachedAuthorization);
    } else {
      return {};
    }
  }

  // TODO: Document
  async connect() {
    const cachedAuthorization = await this.fetchCachedAuthorization();

    super.connect({
      auth: {
        ...sendCachedAuthorization(cachedAuthorization),
      },
    });

    // TODO: Build out & refactor
    const _handleAuthorizationGranted = async receivedAuthorization => {
      const cachedAuthorization = await this.fetchCachedAuthorization();

      // TODO: Remove
      console.log({ receivedAuthorization });

      const localStorageEngine =
        this.useServiceClass(KeyVaultService).getLocalStorageEngine();

      // TODO: Tie into persistent storage service w/ encrypted engine

      if (receivedAuthorization.serverBuildHash !== CLIENT_BUILD_HASH) {
        // Force reload to try to update to latest hash
        //
        // TODO: Make work w/ service worker once PWA is available
        // TODO: Use app updater service instead of force reload
        // window.location.reload(true);
        console.warn(
          `Server build hash "${receivedAuthorization.serverBuildHash}" does not match REACT_APP_GIT_HASH "${CLIENT_BUILD_HASH}"`
        );
      } else {
        // Merge what's in our cache w/ what was received
        const mergedAuthorization = getMergedAuthorization(
          cachedAuthorization,
          receivedAuthorization
        );

        // _setDeviceAddress(mergedAuthorization.clientIdentity.address);

        // Write to local storage
        localStorageEngine.setItem(
          KEY_SERVICE_AUTHORIZATION,
          JSON.stringify(mergedAuthorization)
        );

        // Instantiate SocketAPIClient
        // new SocketAPIClient(socket);

        // _setSocket(socket);
      }
    };

    this._socket.once(
      SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED,
      _handleAuthorizationGranted
    );
  }
}

// TODO: Remove

/**
 * Service authentication wrapper around Socket.io.
 */
/*
export default function useAuthenticatedSocket() {
  const [socket, _setSocket] = useState(null);

  // NOTE: The deviceAddress represents the client id, and can be shared
  // between devices
  const [deviceAddress, _setDeviceAddress] = useState(null);

  const { getItem, setItem } = useLocalStorage();

  useEffect(() => {
    // Retrieve from local storage
    const cachedAuthorization = getItem(KEY_SERVICE_AUTHORIZATION) || {};

    const socket = io("/", {
      auth: {
        ...sendCachedAuthorization(cachedAuthorization),
      },
    });

    socket.on(EVT_CONNECT_ERROR, err => {
      console.warn("Caught", err);
    });

    const _handleAuthorizationGranted = receivedAuthorization => {
      if (receivedAuthorization.serverBuildHash !== CLIENT_BUILD_HASH) {
        // Force reload to try to update to latest hash
        //
        // TODO: Make work w/ service worker once PWA is available
        // window.location.reload(true);
        console.warn(
          `Server build hash "${receivedAuthorization.serverBuildHash}" does not match REACT_APP_GIT_HASH "${CLIENT_BUILD_HASH}"`
        );
      } else {
        // Merge what's in our cache w/ what was received
        const mergedAuthorization = getMergedAuthorization(
          cachedAuthorization,
          receivedAuthorization
        );

        _setDeviceAddress(mergedAuthorization.clientIdentity.address);

        // Write to local storage
        setItem(KEY_SERVICE_AUTHORIZATION, mergedAuthorization);

        // Instantiate SocketAPIClient
        new SocketAPIClient(socket);

        _setSocket(socket);
      }
    };

    socket.once(
      SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED,
      _handleAuthorizationGranted
    );

    return function unmount() {
      socket.off(
        SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED,
        _handleAuthorizationGranted
      );

      socket.disconnect();

      _setSocket(null);
    };
  }, [setItem, getItem]);

  return { socket, deviceAddress };
}
*/
