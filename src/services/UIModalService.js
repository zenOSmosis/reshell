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
  showModal({ view, onClose = () => null }) {
    this.setState({
      // Add new modals to end of stack
      modals: [
        ...this.getState().modals,
        {
          view,
          onClose,
          uuid: uuidv4(),
        },
      ],
    });
  }

  // TODO: Document
  closeModalWithUUID(uuid) {
    const next = this.getState().modals.filter(
      ({ uuid: prevUUID, onClose }) => {
        const isKept = uuid !== prevUUID;

        if (!isKept) {
          // Call the onClose handler passed to showNotification
          onClose();
        }

        return isKept;
      }
    );

    this.setState({
      modals: next,
    });
  }
}
