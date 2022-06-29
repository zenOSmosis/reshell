import { useMemo } from "react";
import Full from "@components/Full";
import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
import Padding from "@components/Padding";
import Center from "@components/Center";
import Cover from "@components/Cover";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED";
import NoWrap from "@components/NoWrap";
import LoadingSpinner from "@components/LoadingSpinner";
import Timer from "@components/Timer";
import ButtonGroup from "@components/ButtonGroup";
import Ellipses from "@components/Ellipses";
import Animation from "@components/Animation";
import WooferAudioLevelMeter from "@components/audioMeters/WooferAudioLevelMeter";

import MicrophoneIcon from "@icons/MicrophoneIcon";

import Networks from "./views/Networks";
import NoNetworks from "./views/NoNetworks";
import NetworkConnected from "./views/NetworkConnected";

import { REGISTRATION_ID as LOCAL_USER_PROFILE_REGISTRATION_ID } from "../LocalUserProfileApp";
import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevicesApp";
import { REGISTRATION_ID as VIRTUAL_SERVER_REGISTRATION_ID } from "../VirtualServerApp";
import { REGISTRATION_ID as SCREEN_CAPTURE_REGISTRATION_ID } from "@portals/ExamplePortal/apps/ScreenCaptureApp";
import { REGISTRATION_ID as CHAT_REGISTRATION_ID } from "../ChatApp";

import useAppRegistrationLink from "@hooks/useAppRegistrationLink";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";
import SpeakerAppNetworkDiscoveryService from "@portals/SpeakerAppPortal/services/SpeakerAppNetworkDiscoveryService";
import SpeakerAppClientZenRTCPeerService from "@portals/SpeakerAppPortal/services/SpeakerAppClientZenRTCPeerService";
import SpeakerAppClientPhantomSessionService from "@portals/SpeakerAppPortal/services/SpeakerAppClientPhantomSessionService";
import SpeakerAppLocalUserProfileService from "@portals/SpeakerAppPortal/services/SpeakerAppLocalUserProfileService";
import InputMediaDevicesService from "@services/InputMediaDevicesService";
import OutputMediaDevicesService from "@services/OutputMediaDevicesService";

import { Video } from "@components/audioVideoRenderers";

export const REGISTRATION_ID = "network";

// TODO: Show current network detail

// TODO: Listen for GET requests and automatically connect to network if
// request is similar to:
// network/0x678308810e1087A3aED280d0feB957C9fcEd1C8B/48k-lounge

// TODO: Implement footer with icons to change things (i.e. mute / unmute, show participants [as overlay over screenshare], etc.)

const CallPlayerApp = {
  id: REGISTRATION_ID,
  title: "Call Player",
  style: {
    width: 640 * 1.5,
    height: 480 * 1.2,
  },
  isPinned: true,
  isPinnedToDock: true,
  serviceClasses: [
    SpeakerAppSocketAuthenticationService,
    SpeakerAppNetworkDiscoveryService,
    SpeakerAppClientZenRTCPeerService,
    SpeakerAppClientPhantomSessionService,
    SpeakerAppLocalUserProfileService,
    InputMediaDevicesService,
    OutputMediaDevicesService,
  ],
  // TODO: Show network name either here or in footer...
  titleBarView: function View({ windowController, appServices }) {
    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const title = windowController.getTitle();
    const localZenRTCPeerService =
      appServices[SpeakerAppClientZenRTCPeerService];
    const inputMediaDevicesService = appServices[InputMediaDevicesService];

    const isZenRTCConnecting = localZenRTCPeerService.getIsConnecting();
    const isZenRTCConnected = localZenRTCPeerService.getIsConnected();
    const networkName = localZenRTCPeerService.getNetworkName();

    const isCapturingAnyAudio =
      inputMediaDevicesService.getIsCapturingAnyAudio();
    const isAllAudioMuted = inputMediaDevicesService.getIsAllAudioMuted();

    return (
      <Row>
        <Column disableHorizontalFill>
          <NoWrap>
            <button
              style={{
                backgroundColor: "#CD1F2A",
                float: "left",
                width: "8em",
              }}
              onClick={localZenRTCPeerService.disconnect}
              disabled={!isZenRTCConnected}
              title="Disconnect"
            >
              <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                {!isZenRTCConnected ? "Call Time" : "Disconnect"}
              </div>
              <div>
                <Timer onTick={localZenRTCPeerService.getConnectionUptime} />
              </div>
            </button>

            <div
              style={{
                display: "inline-block",
                textAlign: "center",
                marginLeft: 10,
              }}
            >
              <AppLinkButton
                id={INPUT_MEDIA_DEVICES_REGISTRATION_ID}
                style={{
                  color:
                    !isCapturingAnyAudio || isAllAudioMuted
                      ? "inherit"
                      : "orange",
                }}
              >
                <div>
                  <MicrophoneIcon
                    style={{
                      fontSize: "1.4em",
                    }}
                  />
                </div>
                <div style={{ fontSize: ".9em", marginTop: 2 }}>
                  {!isCapturingAnyAudio || isAllAudioMuted ? "Off" : "On"}
                </div>
              </AppLinkButton>

              <div
                style={{
                  display: "inline-block",
                  marginLeft: 10,
                  verticalAlign: "bottom",
                }}
              >
                <LabeledLED
                  label="Socket"
                  color={socketService.getIsConnected() ? "green" : "gray"}
                />
                <LabeledLED
                  label="zenRTC"
                  color={
                    isZenRTCConnected
                      ? "green"
                      : isZenRTCConnecting
                      ? "yellow"
                      : "gray"
                  }
                />
              </div>
            </div>
          </NoWrap>
        </Column>
        <Column>
          <Ellipses
            style={{ fontWeight: "bold", marginTop: 12, marginLeft: 4 }}
          >
            {!networkName ? title : `${networkName} Network`}
          </Ellipses>
        </Column>
      </Row>
    );
  },
  view: function View({ /* windowController, */ appServices }) {
    // Automatically maximize on start
    // TODO: Implement ability to start auto-maximized without relying on
    // useEffect
    /*
    useEffect(() => {
      // NOTE: The following timeout is for visual effect only, as Safari seems
      // to render the window fully expanded first
      const to = setTimeout(() => {
        windowController.maximize();
      }, 1000);

      return function unmount() {
        clearTimeout(to);
      };
    }, [windowController]);
    */

    const { link: handleOpenChat } =
      useAppRegistrationLink(CHAT_REGISTRATION_ID);

    // FIXME: Handle condition where socket isn't connected
    // const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const networkDiscoveryService =
      appServices[SpeakerAppNetworkDiscoveryService];

    const networks = networkDiscoveryService.getNetworks();
    const lenNetworks = networks.length;

    const localZenRTCPeerService =
      appServices[SpeakerAppClientZenRTCPeerService];
    const phantomSessionService =
      appServices[SpeakerAppClientPhantomSessionService];
    const outputMediaDevicesService = appServices[OutputMediaDevicesService];

    const inputMediaDevicesService = appServices[InputMediaDevicesService];

    const captureFactories = inputMediaDevicesService.getCaptureFactories();
    const inputAudioMediaStreamTracks = captureFactories
      .map(factory =>
        factory
          .getAudioTrackControllers()
          .map(controller => controller.getOutputMediaStreamTrack())
      )
      .flat();

    const incomingAudioMediaStreamTracks =
      outputMediaDevicesService.getOutputAudioMediaStreamTracks();

    const mergedAudioMediaStreamTracks = useMemo(
      () => [...inputAudioMediaStreamTracks, ...incomingAudioMediaStreamTracks],
      [inputAudioMediaStreamTracks, incomingAudioMediaStreamTracks]
    );

    const { link: handleCreateNetwork } = useAppRegistrationLink(
      VIRTUAL_SERVER_REGISTRATION_ID
    );

    /*
    const handleOpenPrivateNetwork = useCallback(() => {
      alert("TODO: Implement handleOpenPrivateNetwork");
    }, []);
    */

    const isZenRTCConnecting = localZenRTCPeerService.getIsConnecting();
    const isZenRTCConnected = localZenRTCPeerService.getIsConnected();

    const connectionStatus = useMemo(() => {
      if (isZenRTCConnecting) {
        return "Connecting";
      } else if (isZenRTCConnected) {
        return "Connected";
      } else {
        return "Not Connected to a Network";
      }
    }, [isZenRTCConnecting, isZenRTCConnected]);

    const localPhantomPeer = phantomSessionService.getLocalPhantomPeer();
    const remotePhantomPeers = phantomSessionService.getRemotePhantomPeers();

    const lenPeers = !isZenRTCConnected ? 0 : remotePhantomPeers.length + 1;

    // FIXME: This is confusing: incoming = outgoing?  What's going on here?
    const incomingVideoTracks =
      outputMediaDevicesService.getOutputVideoMediaStreamTracks();
    const latestIncomingVideoTrack = useMemo(() => {
      if (incomingVideoTracks && isZenRTCConnected) {
        return incomingVideoTracks[incomingVideoTracks.length - 1];
      }
    }, [incomingVideoTracks, isZenRTCConnected]);

    return (
      <Full>
        <Cover>
          {
            // TODO: Add video controls for:
            //  - Fullscreen
            //  - Showing / hiding UI overlay
          }
          {latestIncomingVideoTrack && (
            <Animation animationName="fadeIn">
              <Video mediaStreamTrack={latestIncomingVideoTrack} />
            </Animation>
          )}
        </Cover>

        {!latestIncomingVideoTrack && (
          <Cover>
            <Padding>
              <WooferAudioLevelMeter
                mediaStreamTracks={mergedAudioMediaStreamTracks}
              />
            </Padding>
          </Cover>
        )}

        <Cover>
          {!latestIncomingVideoTrack && (
            <Animation animationName="fadeIn" animationDuration="5s">
              <Layout style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
                <Header
                  style={{
                    textAlign: "center",
                    backgroundColor: "rgba(999,999,999,.05)",
                  }}
                >
                  <Padding>
                    <ButtonGroup>
                      <AppLinkButton
                        id={INPUT_MEDIA_DEVICES_REGISTRATION_ID}
                        title="Configure Audio"
                      />
                      <AppLinkButton id={LOCAL_USER_PROFILE_REGISTRATION_ID} />
                      {!isZenRTCConnecting && !isZenRTCConnected ? (
                        <AppLinkButton
                          id={VIRTUAL_SERVER_REGISTRATION_ID}
                          title="Create Network"
                        />
                      ) : (
                        <AppLinkButton
                          id={SCREEN_CAPTURE_REGISTRATION_ID}
                          title="Screen Capture"
                        />
                      )}
                    </ButtonGroup>
                  </Padding>
                </Header>
                <Content>
                  <Layout>
                    <Content>
                      <Animation
                        animationName="bounceInDown"
                        animationDuration="2s"
                        animationDelay="1s"
                      >
                        {!isZenRTCConnected && !isZenRTCConnecting ? (
                          <Center canOverflow={true}>
                            {lenNetworks === 0 ? (
                              <NoNetworks
                                onCreateNetwork={handleCreateNetwork}
                              />
                            ) : (
                              <Networks
                                networks={networks}
                                // isConnected,
                                // realmId,
                                // channelId,
                                onConnectToNetwork={
                                  localZenRTCPeerService.connect
                                }
                                onDisconnectFromNetwork={
                                  localZenRTCPeerService.disconnect
                                }
                              />
                            )}
                          </Center>
                        ) : (
                          <NetworkConnected
                            localPhantomPeer={localPhantomPeer}
                            remotePhantomPeers={remotePhantomPeers}
                            onOpenChat={handleOpenChat}
                          />
                        )}
                      </Animation>
                    </Content>
                    <Footer
                      style={{
                        fontSize: ".8rem",
                        backgroundColor: "rgba(0,0,0,.2)",
                      }}
                    >
                      <Padding>
                        <span>{connectionStatus}</span>{" "}
                        {isZenRTCConnected && (
                          <span>
                            {" "}
                            / {`${lenPeers} peer${lenPeers !== 1 ? "s" : ""}`}
                          </span>
                        )}
                      </Padding>
                    </Footer>
                  </Layout>
                </Content>
              </Layout>
            </Animation>
          )}
        </Cover>
        {isZenRTCConnecting && (
          <Cover style={{ backgroundColor: "rgba(0,0,0,.2)" }}>
            <Center>
              <LoadingSpinner />
            </Center>
          </Cover>
        )}
      </Full>
    );
  },
};

export default CallPlayerApp;
