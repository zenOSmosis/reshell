import UIServiceCore from "@core/classes/UIServiceCore";
import KeyVaultService from "./KeyVaultService";
import EthCrypto from "eth-crypto";

// TODO: Refactor
const LS_KEY_DEVICE_IDENTIFICATION = "id0";

const { getInMemoryLocalIdentity, setInMemoryLocalIdentity } = (() => {
  let localIdentity = null;

  return {
    getInMemoryLocalIdentity: () => localIdentity,
    setInMemoryLocalIdentity: localIdentity => localIdentity,
  };
})();

// TODO: Implement public key compression / decompression?

// TODO: Document
export default class LocalDeviceIdentificationService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Local Device Identification Service");

    this._keyVaultService = this.useServiceClass(KeyVaultService);
  }

  /**
   * @return {Promise<void>}
   */
  async initLocalIdentity() {
    // NOTE: We're not concerned about returning the identity itself here, just
    // initializing it
    await this.fetchLocalIdentity();
  }

  // TODO: Document
  async fetchLocalIdentity() {
    const inMemoryLocalIdentity = getInMemoryLocalIdentity();

    if (inMemoryLocalIdentity) {
      return inMemoryLocalIdentity;
    } else {
      const secureLocalStorageEngine =
        this._keyVaultService.getSecureLocalStorageEngine();

      let localIdentity = await secureLocalStorageEngine.fetchItem(
        LS_KEY_DEVICE_IDENTIFICATION
      );

      if (!localIdentity) {
        localIdentity = this._generateLocalIdentity();

        await secureLocalStorageEngine.setItem(
          LS_KEY_DEVICE_IDENTIFICATION,
          localIdentity
        );
      }

      setInMemoryLocalIdentity(localIdentity);

      return localIdentity;
    }
  }

  /**
   * Generates a local identity without storing it directly.
   *
   * @return {Object}
   */
  _generateLocalIdentity() {
    // const entropy = Buffer.from('f2dacf...', 'utf-8'); // must contain at least 128 chars

    const { address, privateKey, publicKey } =
      EthCrypto.createIdentity(/* entropy */);

    return {
      address,
      privateKey,
      publicKey,
    };
  }

  // TODO: Implement and document
  /*
  validateLocalPublicKey() {
    // @see https://www.npmjs.com/package/eth-crypto#publickeytoaddress (publicKey.toAddress())
  }
  */

  /**
   * Retrieves local address, derived from Ethereum identity associated with
   * this service.
   *
   * @return {Promise<string>}
   */
  async fetchLocalAddress() {
    const { address } = await this.fetchLocalIdentity();

    if (!address) {
      throw new ReferenceError("Could not obtain address from local identity");
    }

    return address;
  }

  /**
   * Alias to this.fetchLocalAddress().
   *
   * @return {Promise<string>}
   */
  async fetchDeviceAddress() {
    return this.fetchLocalAddress();
  }

  /**
   * Retrieves local public key, derived from Ethereum identity associated with
   * this service.
   *
   * @return {Promise<string}
   */
  async fetchLocalPublicKey() {
    const { publicKey } = await this.fetchLocalIdentity();

    if (!publicKey) {
      throw new ReferenceError(
        "Could not obtain public key from local identity"
      );
    }

    return publicKey;
  }

  // TODO: Implement and document
  /*
  async fetchLocalPrivateKey(requestor) {
    // TODO: Validate requestor
  }
  */
}
