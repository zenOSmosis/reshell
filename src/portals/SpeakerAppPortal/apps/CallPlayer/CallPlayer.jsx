// import { useEffect } from "react";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Center from "@components/Center";
import Cover from "@components/Cover";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED";
import NoWrap from "@components/NoWrap";
import StaggeredWaveLoading from "@components/StaggeredWaveLoading";
import Timer from "@components/Timer";

import Networks from "./views/Networks";
import NoNetworks from "./views/NoNetworks";
import NetworkConnected from "./views/NetworkConnected";

import { REGISTRATION_ID as LOCAL_USER_PROFILE_REGISTRATION_ID } from "../LocalUserProfile";
import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevices";
import { REGISTRATION_ID as VIRTUAL_SERVER_REGISTRATION_ID } from "../VirtualServer";
import { REGISTRATION_ID as SCREEN_CAPTURE_REGISTRATION_ID } from "@portals/ExamplePortal/apps/ScreenCapture";

// import useAppRegistrationLink from "@hooks/useAppRegistrationLink";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";
import SpeakerAppNetworkDiscoveryService from "@portals/SpeakerAppPortal/services/SpeakerAppNetworkDiscoveryService";
import SpeakerAppLocalZenRTCPeerService from "@portals/SpeakerAppPortal/services/SpeakerAppLocalZenRTCPeerService";
import SpeakerAppClientPhantomSessionService from "@portals/SpeakerAppPortal/services/SpeakerAppClientPhantomSessionService";
import SpeakerAppLocalUserProfileService from "@portals/SpeakerAppPortal/services/SpeakerAppLocalUserProfileService";
import OutputMediaDevicesService from "@services/OutputMediaDevicesService";

export const REGISTRATION_ID = "network";

// TODO: Listen for GET requests and automatically connect to network if
// request is similar to:
// network/0x678308810e1087A3aED280d0feB957C9fcEd1C8B/48k-lounge

const CallPlayer = {
  id: REGISTRATION_ID,
  title: "Call Player",
  style: {
    // TODO: Re-implement once window auto-maximizes on mobile (currently has
    // bottom buttons hide behind dock)
    // @link https://github.com/jzombie/pre-re-shell/issues/95
    width: 640 /* * 1.5*/,
    height: 480 /* * 1.5*/,
  },
  isAutoStart: true,
  isPinned: true,
  isPinnedToDock: true,
  serviceClasses: [
    SpeakerAppSocketAuthenticationService,
    SpeakerAppNetworkDiscoveryService,
    SpeakerAppLocalZenRTCPeerService,
    SpeakerAppClientPhantomSessionService,
    SpeakerAppLocalUserProfileService,
    OutputMediaDevicesService,
  ],
  titleBarView: function View({ windowController, appServices }) {
    const title = windowController.getTitle();
    const localZenRTCPeerService =
      appServices[SpeakerAppLocalZenRTCPeerService];

    const isZenRTCConnected = localZenRTCPeerService.getIsConnected();

    return !isZenRTCConnected ? (
      <div
        style={{ fontWeight: "bold", textAlign: "center", marginLeft: "10%" }}
      >
        {title}
      </div>
    ) : (
      <NoWrap>
        <button
          style={{ backgroundColor: "red" }}
          onClick={localZenRTCPeerService.disconnect}
        >
          Disconnect
        </button>
        <Timer
          onTick={localZenRTCPeerService.getConnectionUptime}
          style={{ marginLeft: 10 }}
        />
        <span style={{ fontWeight: "bold", marginLeft: 10 }}>{title}</span>
      </NoWrap>
    );
  },
  view: function View({ windowController, appServices }) {
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

    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const networkDiscoveryService =
      appServices[SpeakerAppNetworkDiscoveryService];
    const localZenRTCPeerService =
      appServices[SpeakerAppLocalZenRTCPeerService];
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
        <Header>
          <Padding>
            <NoWrap className="button-group">
              <AppLinkButton id={LOCAL_USER_PROFILE_REGISTRATION_ID} />
              <AppLinkButton
                id={VIRTUAL_SERVER_REGISTRATION_ID}
                title="Create Network"
              />
            </NoWrap>
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
              />
            )}
          </Padding>
          {isZenRTCConnecting && (
            <Cover style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
              <Center>
                <StaggeredWaveLoading />
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

export default CallPlayer;
