import React, { useEffect, useCallback, useState } from "react";
// import Cover from "@components/Cover";
import Center from "@components/Center";
import Section from "@components/Section";
import ButtonPanel from "@components/ButtonPanel";
import Form from "@components/Form";

import styles from "./NetworkCreatorForm.module.css";

// import useWebPhantomSessionContext from "@hooks/useWebPhantomSessionContext";
import useObjectState from "@hooks/useObjectState";

// import useClientDeviceContext from "@hooks/useClientDeviceContext";

import PadlockOpenIcon from "@icons/PadlockOpenIcon";
import PadlockCloseIcon from "@icons/PadlockCloseIcon";
import SimpleIcon from "@icons/SimpleIcon";
import AdvancedIcon from "@icons/AdvancedIcon";
// import EmbeddedIcon from "@icons/EmbeddedIcon";
// import NewTabIcon from "@icons/NewTabIcon";
// import ReplaceIcon from "@icons/ReplaceIcon";
import RocketIcon from "@icons/RocketIcon";
// import ServerIcon from "@icons/ServerIcon";

// import meshNetwork from "@assets/network/mesh.svg";
// import mfuNetwork from "@assets/network/mfu.svg";

// import { KEY_VIRTUAL_SERVER_LOCAL_STORAGE_CREDS } from "@local/localStorageKeys";

// import { getCallURL, ROUTE_CALL_URL } from "@baseApps/MainApp/routes";

//  TODO: Include literature of how a browser tab is utilized as a virtual
// machine in order to host the room

// TODO: Implement auto-connect-to-network toggle (perhaps in advanced; default to true)

// TODO: Implement optional setting for stereo / mono stream negotiations

// TODO: Document and use prop-types
export default function CreateNetwork({
  deviceAddress,
  onSubmit,
  initialNetworkName = "",
  initialNetworkDescription = "",
  initialIsPublic = true,
  initialRealmId = "",
  initialChannelId = "",
  initialIsShowingAdvanced = false,
}) {
  // const { getItem, setItem } = useLocalStorage();
  // const { openRoute } = useAppRoutesContext();

  // const { deviceAddress } = useClientDeviceContext();

  const [elInputNetworkName, setElInputNetworkName] = useState(null);

  // Apply auto-focus to network name element
  useEffect(() => {
    if (elInputNetworkName) {
      elInputNetworkName.focus();
    }
  }, [elInputNetworkName]);

  // TODO: Use Form component to manage internal state?
  const [
    {
      networkName,
      networkDescription,
      isPublic,
      realmId,
      channelId,
      isShowingAdvanced,
      // launchTarget,
    },
    setState,
  ] = useObjectState(
    // TODO: Obtain defaults from storage cache

    /* getItem(KEY_VIRTUAL_SERVER_LOCAL_STORAGE_CREDS) || */ {
      // Default form values
      //
      networkName: initialNetworkName,
      networkDescription: initialNetworkDescription,
      // TODO: Change isPublic default to false after adding in ability to connect to private networks
      isPublic: initialIsPublic,
      realmId: initialRealmId || deviceAddress,
      channelId: initialChannelId,
      isShowingAdvanced: initialIsShowingAdvanced,
      // launchTarget: LAUNCH_TARGET_IFRAME,
    }
  );

  /*
  const {
    initVirtualServer,
    destroyVirtualServer,
    isVirtualServerConnected,
  } = useVirtualServerSandboxContext();
  */

  const handleSubmit = useCallback(() => {
    onSubmit({
      networkName,
      networkDescription,
      isPublic,
      realmId,
      channelId,
      isShowingAdvanced,
    });
  }, [
    networkName,
    networkDescription,
    isPublic,
    realmId,
    channelId,
    isShowingAdvanced,
    onSubmit,
  ]);

  // Auto-populate channel id based on network name
  //
  // TODO: Improve / refactor this handling...
  useEffect(() => {
    setState({
      // TODO: Use encodeURIComponent for this and other related handling
      channelId: networkName.toLowerCase().replaceAll(" ", "-"),
    });
  }, [networkName, setState]);

  return (
    <Center canOverflow={true} style={{ maxWidth: 720 }}>
      <div className={styles["create-network-form"]}>
        <Form
          onSubmit={handleSubmit}
          // TODO: Use form validator
        >
          {
            // TODO: Use error handler / validity checks
          }
          {({ errors, isValid }) => (
            <>
              <Section style={{ textAlign: "center" }}>
                <div
                  className="note"
                  style={{ textAlign: "center", margin: 20 }}
                >
                  <p>
                    All traffic in / out of this network will be routed through
                    your device.
                  </p>
                  <p>
                    Networks created here are temporary and only active while
                    this device is online.
                  </p>
                </div>

                <ButtonPanel
                  buttons={[
                    {
                      content: () => (
                        <span>
                          Simple{" "}
                          <SimpleIcon
                            style={{ marginLeft: 4, fontSize: "1.2em" }}
                          />
                        </span>
                      ),
                      onClick: () =>
                        setState({
                          isShowingAdvanced: false,
                        }),
                      isSelected: !isShowingAdvanced,
                    },
                    {
                      content: () => (
                        <span>
                          Advanced{" "}
                          <AdvancedIcon
                            style={{ marginLeft: 4, fontSize: "1.2em" }}
                          />
                        </span>
                      ),
                      onClick: () => setState({ isShowingAdvanced: true }),
                      isSelected: isShowingAdvanced,
                    },
                  ]}
                />
              </Section>

              <div
                style={{
                  width: "100%",
                  // maxWidth: 640,
                  // display: "inline-block",
                  // textAlign: "left",
                }}
              >
                <Section>
                  {
                    // TODO:: Use htmlFor attributes on the labels
                    // TODO: Add error handling / messages
                  }
                  <label>Network Name</label>
                  <input
                    ref={setElInputNetworkName}
                    type="text"
                    name="networkName"
                    value={networkName}
                    onChange={evt =>
                      setState({
                        networkName: evt.target.value,
                      })
                    }
                  />
                </Section>

                <Section>
                  <input
                    type="hidden"
                    name="isPublic"
                    value={isPublic ? "on" : "off"}
                  />

                  <div style={{ textAlign: "center" }}>
                    <div className="note">Select network type:</div>
                    <ButtonPanel
                      buttons={[
                        {
                          content: () => (
                            <span>
                              Public{" "}
                              <PadlockOpenIcon style={{ fontSize: "1.2em" }} />
                            </span>
                          ),
                          onClick: () => setState({ isPublic: true }),
                          isSelected: isPublic,
                        },
                        {
                          content: () => (
                            <span>
                              Private{" "}
                              <PadlockCloseIcon style={{ fontSize: "1.2em" }} />
                            </span>
                          ),
                          onClick: () => setState({ isPublic: false }),
                          isSelected: !isPublic,

                          // TODO: Enable private network selection
                          disabled: true,
                        },
                      ]}
                    />
                  </div>
                  <div className="note" style={{ marginTop: 10 }}>
                    Public networks can be seen by everyone and are displayed
                    within the "Networks" tab.
                  </div>
                </Section>

                <Section>
                  <label>Description (optional)</label>
                  <textarea
                    name="networkDescription"
                    value={networkDescription}
                    onChange={evt =>
                      setState({
                        networkDescription: evt.target.value,
                      })
                    }
                    placeholder="The topic or some other interesting detail to let others know what this network is about"
                  ></textarea>
                </Section>

                {isShowingAdvanced && (
                  <>
                    <Section style={{ overflow: "auto" }}>
                      <h2>Routing</h2>
                      <div style={{ width: "48%", float: "left" }}>
                        <label>Realm</label>
                        <input
                          type="text"
                          name="realmId"
                          value={realmId}
                          onChange={evt =>
                            setState({
                              realmId: evt.target.value,
                            })
                          }
                        />
                      </div>

                      <div
                        style={{
                          width: "48%",
                          float: "right",
                        }}
                      >
                        <label>Channel</label>
                        <input
                          type="text"
                          name="channelId"
                          value={channelId}
                          onChange={evt =>
                            setState({
                              channelId: evt.target.value,
                            })
                          }
                        />
                      </div>
                    </Section>
                  </>
                )}

                <Section style={{ textAlign: "center" }}>
                  {
                    // TODO: After launching, show share URL / QR code
                  }

                  {
                    // TODO: Move launch button to window footer
                  }
                  <button
                    disabled={!networkName.length}
                    style={{ backgroundColor: "green" }}
                    type="submit"
                  >
                    Launch{" "}
                    <RocketIcon
                      style={{ fontSize: "1.8rem", verticalAlign: "middle" }}
                    />
                  </button>
                </Section>
              </div>
            </>
          )}
        </Form>
      </div>
    </Center>
  );
}
