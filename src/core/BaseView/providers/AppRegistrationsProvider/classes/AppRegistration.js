import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

const _registrations = {};

// TODO: Document
// A reference node for the desktop to determine what should be listed in program menus
export default class AppRegistration extends PhantomCore {
  // TODO: Validate appDescriptor

  // TODO: Document
  static addOrUpdateAppRegistration(appDescriptor) {
    const { id } = appDescriptor;

    if (_registrations[id]) {
      // Automatically update the registration
      _registrations[id].updateAppDescriptor(appDescriptor);

      return _registrations[id];
    } else {
      return new AppRegistration(appDescriptor);
    }
  }

  // TODO: Document
  static async removeAppRegistration(appDescriptor) {
    const { id } = appDescriptor;

    if (_registrations[id]) {
      return _registrations[id].destroy();
    }
  }

  // TODO: Document
  constructor(appDescriptor) {
    super();

    // TODO: Document type
    this._appDescriptor = appDescriptor;

    _registrations[appDescriptor.id] = this;
  }

  /**
   * @return {string | number}
   */
  getID() {
    return this._appDescriptor.id;
  }

  /**
   * @return {string}
   */
  getTitle() {
    return this._appDescriptor.title;
  }

  /**
   * Returns whether or not the application is pinned to the desktop menu.
   *
   * @return {boolean}
   */
  getIsPinned() {
    return Boolean(this._appDescriptor.isPinned);
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

  // TODO: Document type
  getAppDescriptor() {
    return this._appDescriptor;
  }
}
