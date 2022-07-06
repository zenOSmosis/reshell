import React from "react";
import Layout, { Header, Content, Footer } from "@components/Layout";
// import Cover from "@components/Cover";
import Center from "@components/Center";
import Background from "@components/Background";

// import NetworkTypeButtonPanelSection from "./NetworkTypeButtonPanelSection";

import CallIcon from "@icons/CallIcon";
import HangupIcon from "@icons/HangupIcon";
import PadlockOpenIcon from "@icons/PadlockOpenIcon";
import PadlockCloseIcon from "@icons/PadlockCloseIcon";
import SpeakerIcon from "@icons/SpeakerIcon";

import styles from "./Networks.module.css";

import dayjs from "dayjs";

/*
import useAppRoutesContext from "@hooks/useAppRoutesContext";
import useNetworksQuery from "@hooks/useNetworksQuery";
import useSocketContext from "@hooks/useSocketContext";
import useWebPhantomSessionContext from "@hooks/useWebPhantomSessionContext";
import useKeyboardEvents from "@hooks/useKeyboardEvents";
import useForceUpdate from "@hooks/useForceUpdate";
*/

// TODO: Prop-types
export default function Networks({
  networks,
  isConnected,
  realmId,
  channelId,
  onConnectToNetwork,
  onDisconnectFromNetwork,
}) {
  return (
    <Center canOverflow={true} className={styles["networks"]}>
      <div>
        {networks.map(network => {
          // TODO: Highlight active network, if currently connected to it
          const isCurrentNetwork =
            isConnected &&
            realmId === network.realmId &&
            channelId === network.channelId;

          const PadlockIcon = network.isPublic
            ? PadlockOpenIcon
            : PadlockCloseIcon;
          const padlockTitle = network.isPublic
            ? "Public Network"
            : "Private Network";

          const strPubPrivNetwork = `${
            network.isPublic ? "Public" : "Private"
          } Network`;

          return (
            <button
              key={network._id}
              className={styles["network"]}
              onClick={() =>
                !isConnected
                  ? onConnectToNetwork(network)
                  : onDisconnectFromNetwork()
              }
              title={
                `[${strPubPrivNetwork}]\n\n` +
                network.name +
                (network.description && network.description.length
                  ? `: ${network.description}`
                  : "") +
                ``
              }
            >
              <Background
                src={
                  network &&
                  network.backgroundImage &&
                  JSON.parse(network.backgroundImage).urls.regular
                }
                style={{
                  backgroundColor: "rgba(0,0,0,.5)",
                  padding: 2,
                }}
              >
                <Layout>
                  <Header>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      <SpeakerIcon style={{ fontSize: "1.8em" }} />
                    </div>
                    <div
                      style={{
                        float: "right",
                        fontWeight: "normal",
                        fontSize: ".8rem",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          textAlign: "right",
                          marginRight: 4,
                        }}
                      >
                        <div>Created: {dayjs(network.createdAt).fromNow()}</div>
                        <div>
                          <span>
                            Participants: {network.connectedParticipants}
                          </span>{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {network.isPublic ? "Public" : "Private"} Network
                          </span>
                        </div>
                      </div>
                      <PadlockIcon
                        title={padlockTitle}
                        style={{ fontSize: "1.8rem", float: "right" }}
                      />
                    </div>
                    <h2
                      className={styles["title"]}
                      /*
                    style={{
                      padding: 0,
                      margin: "0px 0px 4px 0px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    */
                    >
                      {network.name}
                    </h2>
                  </Header>
                  <Content>
                    <div className={styles["description"]}>
                      {network.description}
                    </div>

                    <div style={{ fontSize: ".8rem" }}>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          textAlign: "left",
                          color: "rgba(255,255,255,.5)",
                        }}
                      >
                        <div
                          style={{
                            clear: "both",
                            // maxWidth: "100%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Realm: {network.realmId}
                        </div>

                        <div
                          style={{
                            // maxWidth: "100%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Channel: {network.channelId}
                        </div>
                      </div>
                    </div>
                  </Content>
                  <Footer>
                    <div
                      style={{
                        backgroundColor: "rgba(0,0,0,.4)",
                        padding: 4,
                        fontWeight: "bold",
                        clear: "both",
                      }}
                    >
                      {!isCurrentNetwork ? (
                        <>
                          <CallIcon style={{ color: "green" }} /> Connect
                        </>
                      ) : (
                        <>
                          <HangupIcon
                            style={{
                              color: "#CD1F2A",
                              fontSize: "1.4rem",
                              verticalAlign: "middle",
                            }}
                          />{" "}
                          Disconnect
                        </>
                      )}
                    </div>
                  </Footer>
                </Layout>
              </Background>
            </button>
          );
        })}
      </div>
    </Center>
  );
}
