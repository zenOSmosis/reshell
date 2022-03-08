import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

import KeyVaultService from "@services/KeyVaultService";
import UIModalWidgetService from "@services/UIModalWidgetService";

const KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY = "mesa-sub-1";

// IMPORTANT: Never add a subscription key to client-side code. For advanced guidance on keeping sensitive subscription info secure, see the sample using a server-side auth token
// Reference: https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser

/**
 * Manages the subscription key acquisition and usage for Mesa Azure.
 */
export default class MesaSubscriptionKeyManagementService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Mesa Subscription Key Management Service");

    this.setState({
      hasCachedSubscriptionKey: false,
    });

    this._keyVaultService = this.useServiceClass(KeyVaultService);

    // TODO: Document type
    this._secureLocalStorageEngine =
      this._keyVaultService.getSecureLocalStorageEngine();

    // Perform initial state sync (internally will update
    // hasCachedSubscriptionKey state if found)
    this._fetchSecureLocalStorageSubscriptionKey();

    // Refresh when Key Vault updates
    //
    // NOTE: This fixes issue where deleting store from KeyVault itself would
    // not affect "Speech Input Controller" UI state.
    this.proxyOn(this._keyVaultService, EVT_UPDATED, () => {
      this._fetchSecureLocalStorageSubscriptionKey();
    });
  }

  /**
   * Caches the Azure subscription key to secure local storage.
   *
   * @param {string} subscriptionKey
   * @return {Promise<void>}
   */
  async _setSecureLocalStorageSubscriptionKey(subscriptionKey) {
    await this._secureLocalStorageEngine.setItem(
      KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY,
      subscriptionKey
    );

    this.setState({ hasCachedSubscriptionKey: Boolean(subscriptionKey) });
  }

  /**
   * Retrieves the subscription key, if present, from secure local storage.
   *
   * NOTE: This also sets the service state for hasCachedSubscriptionKey.
   *
   * @return {Promise<string | void>}
   */
  async _fetchSecureLocalStorageSubscriptionKey() {
    const cachedKey = await this._secureLocalStorageEngine.fetchItem(
      KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY
    );

    // Sets the state
    this.setState({ hasCachedSubscriptionKey: Boolean(cachedKey) });

    return cachedKey;
  }

  /**
   * @return {Promise<void>}
   */
  async deleteCachedSubscriptionKey() {
    if (
      !(await this.useServiceClass(UIModalWidgetService).confirm(
        "Are you sure you wish to delete the cached Azure Subscription Key?"
      ))
    ) {
      return;
    }

    await this._secureLocalStorageEngine.removeItem(
      KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY
    );

    this.setState({ hasCachedSubscriptionKey: false });
  }

  /**
   * Retrieves whether or not a cached subscription key is present.
   *
   * @return {boolean}
   */
  getHasCachedSubscriptionKey() {
    return this.getState().hasCachedSubscriptionKey;
  }

  // TODO: Document
  // NOTE: This is intentionally not setting the subscription key to the
  // instance state
  /**
   *
   * @return {string | null} A null value will be returned if the user cancels.
   */
  async acquireSubscriptionKey() {
    // Try to obtain cached subscription key from secure local storage
    let subscriptionKey = await this._fetchSecureLocalStorageSubscriptionKey();

    // If found...
    if (subscriptionKey) {
      // ...return it
      return subscriptionKey;
    }

    // Prompt user to input key
    subscriptionKey = await this.useServiceClass(
      UIModalWidgetService
    ).showTextInputModal({
      label: "Enter Microsoft Azure Subscription Key",
    });

    // TODO: Provide a graceful way out; an error is currently thrown as a
    // cancellation signal
    if (subscriptionKey === null) {
      return null;
    }

    // TODO: Validate as necessary (i.e. w/ string length, etc.)

    if (subscriptionKey) {
      // Cache the subscription key
      await this._setSecureLocalStorageSubscriptionKey(subscriptionKey);

      return subscriptionKey;
    } else {
      // Try again
      return this.acquireSubscriptionKey();
    }
  }
}
