// import { useEffect } from "react";
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
import Image from "@components/Image";

import ZenOSmosisLogo from "@assets/zenOSmosis-Logo-2046x530@72.png";

import MicrophoneIcon from "@icons/MicrophoneIcon";

import Networks from "./views/Networks";
import NoNetworks from "./views/NoNetworks";
import NetworkConnected from "./views/NetworkConnected";
import SoundSystemLayout from "./views/SoundSystemLayout";

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

export const REGISTRATION_ID = "call-theater";

// TODO: Show current network detail

// TODO: Listen for GET requests and automatically connect to network if
// request is similar to:
// network/0x678308810e1087A3aED280d0feB957C9fcEd1C8B/48k-lounge

// TODO: Implement footer with icons to change things (i.e. mute / unmute, show participants [as overlay over screenshare], etc.)

const CallTheaterApp = {
  id: REGISTRATION_ID,
  title: "Call Theater",
  style: {
    width: 640 * 2,
    height: 480 * 1.7,
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
  titleBarView: function View({ windowController, appServices }) {
    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    // const title = windowController.getTitle();
    const localZenRTCPeerService =
      appServices[SpeakerAppClientZenRTCPeerService];
    const inputMediaDevicesService = appServices[InputMediaDevicesService];

    const isZenRTCConnecting = localZenRTCPeerService.getIsConnecting();
    const isZenRTCConnected = localZenRTCPeerService.getIsConnected();

    const isCapturingAnyAudio =
      inputMediaDevicesService.getIsCapturingAnyAudio();
    const isAllAudioMuted = inputMediaDevicesService.getIsAllAudioMuted();

    return (
      <NoWrap>
        <button
          style={{ backgroundColor: "red", float: "left", width: "8em" }}
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
                !isCapturingAnyAudio || isAllAudioMuted ? "inherit" : "orange",
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

    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const networkDiscoveryService =
      appServices[SpeakerAppNetworkDiscoveryService];
    const localZenRTCPeerService =
      appServices[SpeakerAppClientZenRTCPeerService];
    const phantomSessionService =
      appServices[SpeakerAppClientPhantomSessionService];
    const outputMediaDevicesService = appServices[OutputMediaDevicesService];

    const networks = networkDiscoveryService.getNetworks();
    const lenNetworks = networks.length;

    /*
    const { link: virtualServerLink } = useAppRegistrationLink(
      VIRTUAL_SERVER_REGISTRATION_ID
    );

    const handleCreateNetwork = useCallback(virtualServerLink, [
      virtualServerLink,
    ]);

    const handleOpenPrivateNetwork = useCallback(() => {
      alert("TODO: Implement handleOpenPrivateNetwork");
    }, []);
    */

    const isZenRTCConnecting = localZenRTCPeerService.getIsConnecting();
    const isZenRTCConnected = localZenRTCPeerService.getIsConnected();

    // TODO: Refactor and rename
    const latestOutputVideoTrack = (() => {
      const videoTracks =
        outputMediaDevicesService.getOutputVideoMediaStreamTracks();

      if (videoTracks) {
        return videoTracks[videoTracks.length - 1];
      }
    })();

    return (
      <Layout>
        <Header style={{ textAlign: "center" }}>
          Chat / Audio Input / User Profile / Create Network
        </Header>
        <Content>
          <SoundSystemLayout />
        </Content>
        <Footer></Footer>
      </Layout>
    );

    return (
      <Layout>
        <Header>
          <Padding>
            <AppLinkButton
              id={CHAT_REGISTRATION_ID}
              disabled={!isZenRTCConnected}
            />
            <div style={{ float: "right" }}>
              <NoWrap className="button-group">
                <AppLinkButton id={LOCAL_USER_PROFILE_REGISTRATION_ID} />
                <AppLinkButton
                  id={VIRTUAL_SERVER_REGISTRATION_ID}
                  title="Create Network"
                />
              </NoWrap>
            </div>
            {
              // [networks]  [private network]
              /*
                <button>Search</button>
                */
            }
          </Padding>
        </Header>
        <Content>
          <Padding>
            {!isZenRTCConnected ? (
              <Center canOverflow={true}>
                {lenNetworks === 0 ? (
                  <NoNetworks />
                ) : (
                  <Networks
                    networks={networks}
                    // isConnected,
                    // realmId,
                    // channelId,
                    onConnectToNetwork={localZenRTCPeerService.connect}
                    onDisconnectFromNetwork={localZenRTCPeerService.disconnect}
                  />
                )}
              </Center>
            ) : (
              <NetworkConnected
                remotePhantomPeers={phantomSessionService.getRemotePhantomPeers()}
                latestOutputVideoTrack={latestOutputVideoTrack}
                onOpenChat={handleOpenChat}
              />
            )}
          </Padding>
          {isZenRTCConnecting && (
            <Cover style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
              <Center>
                <LoadingSpinner />
              </Center>
            </Cover>
          )}
        </Content>
        <Footer>
          <Padding>
            <span className="button-group">
              <AppLinkButton
                id={INPUT_MEDIA_DEVICES_REGISTRATION_ID}
                title="Configure Audio"
              />
              <AppLinkButton id={SCREEN_CAPTURE_REGISTRATION_ID} />
              <div style={{ float: "right" }}>
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
            </span>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default CallTheaterApp;
