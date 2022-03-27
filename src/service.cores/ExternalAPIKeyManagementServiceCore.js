import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

import KeyVaultService from "@services/KeyVaultService";
import UIModalWidgetService from "@services/UIModalWidgetService";

const LABEL_KEY_ACQUIRE = "acquire";
const LABEL_KEY_CONFIRM_DELETE = "confirmDelete";

const STATE_KEY_HAS_CACHED_API_KEY = "hasCachedAPIKey";

/**
 * Manages acquisition and caching of API keys for external services.
 */
export default class ExternalAPIKeyManagementServiceCore extends UIServiceCore {
  // TODO: Ensure this class is extended (reference: https://github.com/zenOSmosis/phantom-core/issues/149)

  // TODO: Document
  constructor(secureLocalStorageKey, keyNickname = "API", ...args) {
    const LABELS = {
      [LABEL_KEY_ACQUIRE]: `Enter the ${keyNickname} Key`,
      [LABEL_KEY_CONFIRM_DELETE]: `Are you sure you wish to delete the ${keyNickname} Key?`,
    };

    // TODO: Ensure secureLocalStorageKey is unique per instance
    if (!secureLocalStorageKey) {
      throw new ReferenceError("secureLocalStorageKey is not set");
    }

    super(...args);

    this.setTitle(`${keyNickname} Key Management Service`);

    this.setState({
      [STATE_KEY_HAS_CACHED_API_KEY]: false,
    });

    this._secureLocalStorageKey = secureLocalStorageKey;
    this._labels = LABELS;

    this._keyVaultService = this.useServiceClass(KeyVaultService);

    // TODO: Document type
    this._secureLocalStorageEngine =
      this._keyVaultService.getSecureLocalStorageEngine();

    // Perform initial state sync (internally will update
    // hasCachedAPIKey state if found)
    this._fetchCachedAPIKey();

    // Refresh when Key Vault updates
    //
    // NOTE: This fixes issue where deleting store from KeyVault itself would
    // not affect "Speech Input Controller" UI state.
    this.proxyOn(this._keyVaultService, EVT_UPDATED, () => {
      this._fetchCachedAPIKey();
    });
  }

  /**
   * Stores the API key in local storage.
   *
   * @param {string} apiKey
   * @return {Promise<void>}
   */
  async _cacheAPIKey(apiKey) {
    await this._secureLocalStorageEngine.setItem(
      this._secureLocalStorageKey,
      apiKey
    );

    this.setState({ [STATE_KEY_HAS_CACHED_API_KEY]: Boolean(apiKey) });
  }

  /**
   * Retrieves the subscription key, if present, from secure local storage.
   *
   * NOTE: This also sets the service state for hasCachedAPIKey.
   *
   * @return {Promise<string | void>}
   */
  async _fetchCachedAPIKey() {
    const cachedKey = await this._secureLocalStorageEngine.fetchItem(
      this._secureLocalStorageKey
    );

    // Sets the state
    this.setState({ [STATE_KEY_HAS_CACHED_API_KEY]: Boolean(cachedKey) });

    return cachedKey;
  }

  /**
   * Retrieves whether or not there is a cached API key.
   *
   * @return {boolean}
   */
  getHasCachedAPIKey() {
    return this.getState()[STATE_KEY_HAS_CACHED_API_KEY];
  }

  /**
   * Acquires the API key. If a cached key is not present, it will show a UI
   * modal prompting the user to enter one.
   *
   * Note, this is intentionally not setting the API key in the state.
   *
   * @return {string | null} A null value will be returned if the user cancels.
   */
  async acquireAPIKey() {
    // Try to obtain cached subscription key from secure local storage
    let apiKey = await this._fetchCachedAPIKey();

    // If found...
    if (apiKey) {
      // ...return it
      return apiKey;
    }

    // Prompt user to input key
    apiKey = await this.useServiceClass(
      UIModalWidgetService
    ).showTextInputModal({
      label: this._labels[LABEL_KEY_ACQUIRE],
    });

    // TODO: Provide a graceful way out; an error is currently thrown as a
    // cancellation signal
    if (apiKey === null) {
      return null;
    }

    // TODO: Validate as necessary (i.e. w/ string length, etc.)

    if (apiKey) {
      // Cache the subscription key
      await this._cacheAPIKey(apiKey);

      return apiKey;
    } else {
      // Try again
      return this.acquireAPIKey();
    }
  }

  /**
   * Deletes the cached API key.
   *
   * @return {Promise<void>}
   */
  async deleteCachedAPIKey() {
    if (
      !(await this.useServiceClass(UIModalWidgetService).confirm(
        this._labels[LABEL_KEY_CONFIRM_DELETE]
      ))
    ) {
      return;
    }

    await this._secureLocalStorageEngine.removeItem(
      this._secureLocalStorageKey
    );

    this.setState({ [STATE_KEY_HAS_CACHED_API_KEY]: false });
  }
}
