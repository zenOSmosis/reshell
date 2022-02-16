import UIServiceCore from "@core/classes/UIServiceCore";
import { v4 as uuidv4 } from "uuid";

/**
 * Handles management of UI modals.
 */
export default class UIModalService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("UI Modal Service");

    this.setState({
      modals: [],
    });
  }

  // TODO: Document
  showModal(view, options = {}) {
    const uuid = uuidv4();

    let timeout = null;

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
          onClose: _handleClose,
        },
      ],
    });

    // TODO: [To fix issue where typing can still occur on below elements] If
    // an element was focused before modal is displayed, remove the focus, and
    // [potentially] reapply to the element once the modal is gone.  Can
    // underlying elements still be selected and can tabindex somehow fix that?

    // TODO: Refactor
    if (options.duration) {
      timeout = setTimeout(() => {
        this.closeModalWithUUID(uuid);
      }, options.duration);
    }
  }

  // TODO: Document
  closeModalWithUUID(uuid) {
    const next = this.getState().modals.filter(({ uuid: prevUUID }) => {
      const isKept = uuid !== prevUUID;

      return isKept;
    });

    this.setState({
      modals: next,
    });
  }
}
