import ReShellCore from "@core";

import { useCallback, useEffect, useRef, useState } from "react";
import Center from "@components/Center";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";

import fetchIsLatestVersion from "@utils/fetchIsLatestVersion";

import dayjs from "dayjs";

export const REGISTRATION_ID = "check-for-updates";

const CheckForUpdatesApp = {
  id: REGISTRATION_ID,
  title: "Check for Updates",
  style: {
    width: 320,
    height: 240,
  },
  isPinned: true,
  view: function View() {
    const [isLatest, setIsLatest] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastCheckTime, setLastCheckTime] = useState(null);

    const refIsChecking = useRef(null);
    refIsChecking.current = isChecking;

    // TODO: Refactor into service
    const handleCheckForUpdates = useCallback(async () => {
      const isChecking = refIsChecking.current;

      if (isChecking) {
        return;
      }

      try {
        setIsError(false);
        setIsChecking(true);

        const isLatest = await fetchIsLatestVersion();

        setIsLatest(isLatest);
      } catch (err) {
        console.error(err);

        setIsError(true);
        setIsLatest(false);
      } finally {
        setIsChecking(false);
        setLastCheckTime(new Date().getTime());
      }
    }, []);

    // Automatically check for updates when app starts
    useEffect(() => {
      handleCheckForUpdates();
    }, [handleCheckForUpdates]);

    return (
      <Layout>
        <Header>
          <Padding style={{ textAlign: "center" }}>
            <button onClick={handleCheckForUpdates} disabled={isChecking}>
              Check for Updates
            </button>
          </Padding>
        </Header>
        <Content>
          <Center canOverflow={true}>
            {isError ? (
              <>
                <p>
                  There was an error checking for updates.{" "}
                  <button onClick={handleCheckForUpdates}>Try again?</button>
                </p>
              </>
            ) : isLatest ? (
              <p>You appear to be running the latest version of ReShell.</p>
            ) : (
              <>
                <p>
                  Your version of ReShell appears out of date.{" "}
                  <button onClick={() => ReShellCore.forceUpdate()}>
                    Refresh?
                  </button>
                </p>
              </>
            )}
          </Center>
        </Content>
        <Footer>
          <Padding>
            <div className="note">
              Last checked:{" "}
              {lastCheckTime ? dayjs(lastCheckTime).format("LLL") : "N/A"}
            </div>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default CheckForUpdatesApp;
