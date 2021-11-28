import React, { useCallback } from "react";

// import { ModalsStack } from "./views/Modal";
import useServiceClass from "@hooks/useServiceClass";
import UIModalService from "@services/UIModalService";

export const ModalContext = React.createContext({});

// TODO: Document
export default function ModalProvider({ children }) {
  const { serviceInstance, serviceState } = useServiceClass(UIModalService);

  // TODO: Document
  const showModal = useCallback(
    modal => serviceInstance.showModal(modal),
    [serviceInstance]
  );

  // TODO: Document
  const closeModalWithUUID = useCallback(
    uuid => serviceInstance.closeModalWithUUID(uuid),
    [serviceInstance]
  );

  return (
    <ModalContext.Provider
      value={{
        showModal,
      }}
    >
      {children}

      {
        // TODO: Implement
        /*
        <ModalsStack
        modals={serviceState.notifications}
        onModalClose={closeModalWithUUID}
      />
        */
      }
    </ModalContext.Provider>
  );
}
