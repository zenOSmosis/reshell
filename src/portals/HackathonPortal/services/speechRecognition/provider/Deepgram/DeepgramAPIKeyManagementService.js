import ExternalAPIKeyManagementServiceCore from "@service.cores/ExternalAPIKeyManagementServiceCore";

const KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY = "deepgram-sub-1";

/**
 * Manages the subscription key acquisition and usage for Mesa.
 */
export default class DeepgramAPIKeyManagementService extends ExternalAPIKeyManagementServiceCore {
  constructor(...args) {
    super(
      KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY,
      "Deepgram API",
      ...args
    );
  }
}
