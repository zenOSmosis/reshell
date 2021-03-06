import React, { useCallback } from "react";

import ModalStack from "./views/ModalStack";
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

  return (
    <ModalContext.Provider
      value={{
        showModal,
      }}
    >
      {children}

      <ModalStack modals={serviceState.modals} />
    </ModalContext.Provider>
  );
}
