import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

// AppRegistration cache
const _registrations = {};

// TODO: Include ability to register preload resources, to preload when runtime is initiated
// TODO: Include ability to register splash screen, while preloading

// TODO: Include ability to retain window sizes and positions after
// modification (not sure if that should be here or in AppRuntime)

// TODO: Include ability to test condition before applying registration(?)

// TODO: Document
// A reference node for the desktop to determine what should be listed in program menus
export default class AppRegistration extends PhantomCore {
  // TODO: Validate appDescriptor

  // TODO: Move this handling directly into AppRegistrationCollection (do not
  // call from anywhere else)
  /**
   * Registers, or updates, the given AppRegistration cache.
   *
   * This is used primarily for applications menu population.
   *
   * @param {AppRegistration}
   * @return {void}
   */
  static addOrUpdateAppRegistration(appDescriptor) {
    // TODO: Validate against proper type
    if (!Object.keys(appDescriptor).length) {
      throw new TypeError(
        "appDescriptor does not appear to be a valid application descriptor"
      );
    }

    const { id } = appDescriptor;

    // Registrations may be updated when in development mode, and updating the
    // source code to a registered application. In most cases, the following
    // code block will run before the respective application is updated /
    // re-rendered.
    //
    // TODO: Implement some message-bus functionality to let other instances
    // know of updated registrations (i.e. so this can be piped up to UI
    // notification)
    if (_registrations[id]) {
      // Automatically update the registration
      _registrations[id].updateAppDescriptor(appDescriptor);

      return _registrations[id];
    } else {
      return new AppRegistration(appDescriptor);
    }
  }

  // TODO: Move this handling directly into AppRegistrationCollection (do not
  // call from anywhere else)
  /**
   * Unregisters the given AppRegistration from the cache.
   *
   * This will remove the application from the applications menu.
   *
   * @param {AppRegistration | string}
   * @return {void}
   */
  static async removeAppRegistration(appDescriptorOrID) {
    let id = null;
    if (typeof appDescriptor === "object") {
      id = appDescriptorOrID.id;
    } else {
      id = appDescriptorOrID;
    }

    if (_registrations[id]) {
      return _registrations[id].destroy();
    }
  }

  // TODO: Document
  constructor(appDescriptor) {
    // TODO: Validate appDescriptor before trying to use

    super();

    // TODO: Document type
    this._appDescriptor = appDescriptor;

    _registrations[appDescriptor.id] = this;
  }

  /**
   * @return {Object}
   */
  getAppDescriptor() {
    return this._appDescriptor;
  }

  /**
   * Retrieves the app descriptor's ID.
   *
   * NOTE: [appRegistration]ID and appDescriptorID are synonymous here, however
   * they should not be confused with UUID and shortUUID.
   *
   * @return {string}
   */
  getID() {
    return this._appDescriptor.id;
  }

  /**
   * Alias for this.getID().
   *
   * NOTE: [appRegistration]ID and appDescriptorID are synonymous here, however
   * they should not be confused with UUID and shortUUID.
   *
   * @alias <getAppDescriptorID>
   */
  getAppDescriptorID() {
    return this.getID();
  }

  /**
   * @return {string}
   */
  getTitle() {
    return this._appDescriptor.title;
  }

  /**
   * TODO: Document
   *
   * @return {Object | void}
   */
  getMenu() {
    return this._appDescriptor.menu;
  }

  /**
   * TODO: Rename (clarify pin type)
   *
   * Returns whether or not the application is pinned to the desktop menu.
   *
   * @return {boolean}
   */
  getIsPinned() {
    return Boolean(this._appDescriptor.isPinned);
  }

  // TODO: Remove; manage via a service
  getIsPinnedToDock() {
    return Boolean(this._appDescriptor.isPinnedToDock);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    delete _registrations[this._appDescriptor.id];

    return super.destroy();
  }

  // TODO: Document
  updateAppDescriptor(appDescriptor) {
    this._appDescriptor = appDescriptor;

    // TODO: Only emit if something changed
    this.emit(EVT_UPDATED);
  }
}
