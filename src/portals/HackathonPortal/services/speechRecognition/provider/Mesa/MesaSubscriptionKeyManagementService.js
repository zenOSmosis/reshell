import ExternalAPIKeyManagementServiceCore from "@service.cores/ExternalAPIKeyManagementServiceCore";

const KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY = "mesa-sub-1";

// IMPORTANT: Never add a subscription key to client-side code. For advanced guidance on keeping sensitive subscription info secure, see the sample using a server-side auth token
// Reference: https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser

/**
 * Manages the subscription key acquisition and usage for Mesa.
 */
export default class MesaSubscriptionKeyManagementService extends ExternalAPIKeyManagementServiceCore {
  constructor(...args) {
    super(
      KEY_SECURE_LOCAL_STORAGE_MESA_SUBSCRIPTION_KEY,
      "Azure Subscription",
      ...args
    );
  }
}
