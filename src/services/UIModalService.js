import UIServiceCore from "@core/classes/UIServiceCore";
import { v4 as uuidv4 } from "uuid";

/**
 * Handles management of UI modals.
 *
 * FIXME: (jh) This class cannot be reliably extended and still maintain
 * correct functionality in extended services. PhantomCore needs the ability
 * to not be able to extend a class.
 * Relevant issue: https://github.com/zenOSmosis/phantom-core/issues/149
 */
export default class UIModalService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("UI Modal Service");

    this.setState({
      modals: [],
    });
  }

  /**
   * Renders the given modal view.
   *
   * Sends the given React component as a message to the ModalProvider.
   *
   * @param {React.Component} view
   * @param {Object} options? [default = {}] TODO: Document options
   */
  showModal(view, options = {}) {
    const uuid = uuidv4();

    let timeout = null;

    /**
     * Closes the modal.
     *
     * @return {void}
     */
    const _handleClose = () => {
      clearTimeout(timeout);

      this.closeModalWithUUID(uuid);
    };

    this.setState({
      // Add new modals to end of stack
      modals: [
        ...this.getState().modals,
        {
          view,
          uuid,
          // NOTE: It is intended for onCancel and onClose to call the same
          // _handleClose handler, as they are both intended to close the
          // modal. Functionality differences between the two callbacks are
          // handled within the view composition.
          onClose: _handleClose,
          onCancel: _handleClose,
        },
      ],
    });

    // TODO: [To fix issue where typing can still occur on below elements] If
    // an element was focused before modal is displayed, remove the focus, and
    // [potentially] reapply to the element once the modal is gone.  Can
    // underlying elements still be selected and can tabindex somehow fix that?

    // Handles auto-closing of the modal if it has a set duration
    if (options.duration) {
      timeout = setTimeout(() => {
        this.closeModalWithUUID(uuid);
      }, options.duration);
    }
  }

  /**
   * Closes the modal with the given UUID, if exists.
   *
   * @param {string} uuid
   * @return {void}
   */
  closeModalWithUUID(uuid) {
    const nextModals = this.getState().modals.filter(({ uuid: prevUUID }) => {
      const isKept = uuid !== prevUUID;

      return isKept;
    });

    this.setState({
      modals: nextModals,
    });
  }
}
