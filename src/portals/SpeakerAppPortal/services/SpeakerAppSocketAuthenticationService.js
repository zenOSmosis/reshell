import SocketIOService, {
  EVT_CONNECTED,
  EVT_DISCONNECTED,
} from "@services/SocketIOService";
import {
  generateClientAuthentication,
  validateClientAuthorization,
} from "@portals/SpeakerAppPortal/shared/serviceAuthorization/client";
import { SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED } from "@portals/SpeakerAppPortal/shared/socketEvents";
// import { KEY_SERVICE_AUTHORIZATION } from "@portals/SpeakerAppPortal/local/localStorageKeys";
// import KeyVaultService from "@services/KeyVaultService";

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

// TODO: Document
export default class SpeakerAppSocketAuthenticationService extends SocketIOService {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Socket Authentication Service");

    // Automatically connect
    this.connect();
  }

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
      try {
        validateClientAuthorization(
          clientAuthorization,
          clientPublicKey,
          clientDeviceAddress
        );
      } catch (err) {
        console.error(err);

        // Force disconnect if incorrect client authorization
        this.destroy();
      }
    };

    this._socket.once(
      SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED,
      _handleAuthorizationGranted
    );
  }
}
