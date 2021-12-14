import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";
import KeyVaultService from "@services/KeyVaultService";

import { debounce } from "debounce";

import {
  SOCKET_API_ROUTE_GENERATE_PROFILE_AVATAR,
  SOCKET_API_ROUTE_GENERATE_PROFILE_NAME,
  SOCKET_API_ROUTE_GENERATE_PROFILE_DESCRIPTION,
} from "../shared/socketAPIRoutes";

import { KEY_LOCAL_PROFILE } from "@portals/SpeakerAppPortal/local/localStorageKeys";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Document
export default class SpeakerAppLocalUserProfileService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setState({
      avatarURL: null,
      name: null,
      description: null,
    });

    this.setTitle("Speaker.app Local User Profile Service");

    this._socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    this._localStorageEngine =
      this.useServiceClass(KeyVaultService).getSecureLocalStorageEngine();

    // Handle local storage caching of state updates
    (async () => {
      // Set default state, if acquired from local storage profile
      await this._initLocalStorageProfile();

      const handleUpdate = debounce(
        () => {
          this._setLocalStorageProfile();
        },
        10,
        // Use trailing edge
        false
      );

      this.on(EVT_UPDATED, handleUpdate);
    })();
  }

  /**
   * Retrieves the cached state from local storage and writes it to the service
   * state.
   *
   * @return {Promise<void>}
   */
  async _initLocalStorageProfile() {
    const localStorageProfile = await this._localStorageEngine.fetchItem(
      KEY_LOCAL_PROFILE
    );

    if (localStorageProfile) {
      this.setState(localStorageProfile);
    } else {
      return this.autogenerateUserProfile();
    }
  }

  /**
   * Caches the current service state to local storage.
   *
   * @return {Promise<void>}
   */
  async _setLocalStorageProfile() {
    return this._localStorageEngine.setItem(KEY_LOCAL_PROFILE, this.getState());
  }

  /**
   * Automatically obtain random user profile data and set it to the state.
   *
   * @return {Promise<void>}
   */
  async autogenerateUserProfile() {
    const [avatarURL, name, description] = await Promise.all([
      this.fetchAutoGeneratedAvatarURL(),
      this.fetchAutoGeneratedName(),
      this.fetchAutoGeneratedDescription(),
    ]);

    this.setState({
      avatarURL,
      name,
      description,
    });
  }

  /**
   * @return {string | null}
   */
  getAvatarURL() {
    return this.getState().avatarURL;
  }

  /**
   * Auto-generates a random profile avatar.
   *
   * @return {Promise<string>}
   */
  async fetchAutoGeneratedAvatarURL() {
    const avatarURL = await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_GENERATE_PROFILE_AVATAR
    );

    return avatarURL;
  }

  /**
   * @return {string | null}
   */
  getName() {
    return this.getState().name;
  }

  /**
   * Auto-generates a random profile name.
   *
   * @return {Promise<string>}
   */
  async fetchAutoGeneratedName() {
    const name = await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_GENERATE_PROFILE_NAME
    );

    return name;
  }

  /**
   * @return {string | null}
   */
  getDescription() {
    return this.getState().description;
  }

  /**
   * Auto-generates a random profile description.
   *
   * @return {Promise<string>}
   */
  async fetchAutoGeneratedDescription() {
    const description = await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_GENERATE_PROFILE_DESCRIPTION
    );

    return description;
  }
}
