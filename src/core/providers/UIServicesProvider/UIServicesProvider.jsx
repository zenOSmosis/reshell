import React, { useCallback, useEffect, useMemo } from "react";
import ReShellCore from "@core/classes/ReShellCore";

// TODO: Change to namespaced export once PhantomCore supports package.json exports
// @see https://github.com/zenOSmosis/phantom-core/issues/98
import {
  EVT_CHILD_INSTANCE_ADD,
  EVT_CHILD_INSTANCE_REMOVE,
} from "phantom-core";

import useUIServicesAutoStart from "./hooks/useUIServicesAutoStart";

import useForceUpdate from "@hooks/useForceUpdate";

export const UIServicesContext = React.createContext({});

/**
 * Provides the React app with PhantomCore-based UIServiceManager /
 * UIServiceCore binding.
 */
export default function UIServicesProvider({ children }) {
  const forceUpdate = useForceUpdate();

  const _uiServiceManager = useMemo(
    () => ReShellCore.getUIServiceManager(),
    []
  );

  // Manage _uiServiceManager event bindings
  useEffect(() => {
    // Force UI to update when a service has been added or removed
    //
    // IMPORTANT: Collection EVT_UPDATE is not mapped here, and is handled
    // elsewhere, as we don't want the entire UI to update every time
    const _handleServiceAddedOrRemoved = () => {
      // IMPORTANT: This fixes re-render attempts while a child component is
      // being updated (i.e. WindowManager currently is instantiating services
      // during the render cycle)
      queueMicrotask(() => {
        forceUpdate();
      });
    };

    _uiServiceManager.on(EVT_CHILD_INSTANCE_ADD, _handleServiceAddedOrRemoved);

    _uiServiceManager.on(
      EVT_CHILD_INSTANCE_REMOVE,
      _handleServiceAddedOrRemoved
    );

    return function unmount() {
      _uiServiceManager.off(
        EVT_CHILD_INSTANCE_ADD,
        _handleServiceAddedOrRemoved
      );

      _uiServiceManager.off(
        EVT_CHILD_INSTANCE_REMOVE,
        _handleServiceAddedOrRemoved
      );
    };
  }, [forceUpdate, _uiServiceManager]);

  /**
   * Starts the service with the given ServiceClass.
   *
   * If it is already started, subsequent attempts will be ignored.
   *
   * @param {UIServiceCore}
   * @return {void}
   */
  const startServiceClass = useCallback(
    ServiceClass => _uiServiceManager.startServiceClass(ServiceClass),
    [_uiServiceManager]
  );

  // Startup auto-start services
  useUIServicesAutoStart(startServiceClass);

  /**
   * Destructs the service instance with the given ServiceClass.
   *
   * @param {UIServiceCore}
   * @return {Promise<void>}
   */
  /*
  const stopServiceClass = useCallback(
    async ServiceClass => _uiServiceManager.stopServiceClass(ServiceClass),
    [_uiServiceManager]
  );
  */

  return (
    <UIServicesContext.Provider
      value={{
        services: _uiServiceManager && _uiServiceManager.getChildren(),
        startServiceClass,
        // stopServiceClass,
      }}
    >
      {children}
    </UIServicesContext.Provider>
  );
}
