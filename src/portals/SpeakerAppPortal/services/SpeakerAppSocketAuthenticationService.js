import SocketIOService, {
  EVT_CONNECTED,
  EVT_DISCONNECTED,
} from "@services/SocketIOService";
import {
  generateClientAuthentication,
  validateClientAuthorization,
} from "@portals/SpeakerAppPortal/shared/serviceAuthorization/client";
import { SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED } from "@portals/SpeakerAppPortal/shared/socketEvents";
import { KEY_SERVICE_AUTHORIZATION } from "@portals/SpeakerAppPortal/local/localStorageKeys";
import KeyVaultService from "@services/KeyVaultService";

import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

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

// TODO: Document
export default class SpeakerAppSocketAuthenticationService extends SocketIOService {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Socket Authentication Service");

    // Automatically connect
    this.connect();
  }

  // TODO: Remove or refactor
  // TODO: Document
  /*
  async fetchCachedAuthorization() {
    const deviceIdService = this.useServiceClass(
      LocalDeviceIdentificationService
    );

    // TODO: Remove
    console.log({ deviceIdService });

    // TODO: Obtain following from deviceIdService

    const rawCachedAuthorization = await this.useServiceClass(KeyVaultService)
      .getSecureLocalStorageEngine()
      .fetchItem(KEY_SERVICE_AUTHORIZATION);

    let cachedAuthorization = {};

    try {
      if (rawCachedAuthorization) {
        cachedAuthorization = JSON.parse(rawCachedAuthorization);
      }
    } catch (err) {
      console.error(err);
    } finally {
      return cachedAuthorization;
    }
  }
  */

  // TODO: Document
  async connect() {
    const deviceIdService = this.useServiceClass(
      LocalDeviceIdentificationService
    );

    const clientDeviceAddress = await deviceIdService.fetchLocalAddress();
    const clientPublicKey = await deviceIdService.fetchLocalPublicKey();

    const clientAuthentication = generateClientAuthentication(
      clientPublicKey,
      clientDeviceAddress
    );

    super.connect({
      auth: {
        ...clientAuthentication,
      },
    });

    // TODO: Build out & refactor
    const _handleAuthorizationGranted = async clientAuthorization => {
      validateClientAuthorization(
        clientAuthorization,
        clientPublicKey,
        clientDeviceAddress
      );
    };

    this._socket.once(
      SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED,
      _handleAuthorizationGranted
    );
  }
}
