import SocketIOService, {
  EVT_CONNECT,
  EVT_DISCONNECT,
} from "@services/SocketIOService";
import {
  generateClientAuthentication,
  validateClientAuthorization,
} from "@portals/SpeakerAppPortal/shared/serviceAuthorization/client";
import { SOCKET_EVT_CLIENT_AUTHORIZATION_GRANTED } from "@portals/SpeakerAppPortal/shared/socketEvents";

import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

export { EVT_CONNECT, EVT_DISCONNECT };

// TODO: Document
export default class SpeakerAppSocketAuthenticationService extends SocketIOService {
  // TODO: Document
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

    // TODO: Document
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
