import ReShellCore from "@core";

import { useCallback, useEffect, useRef, useState } from "react";
import Center from "@components/Center";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import LabeledLED from "@components/labeled/LabeledLED";

import fetchIsLatestVersion from "@utils/fetchIsLatestVersion";

const CheckForUpdates = {
  id: "check-for-updates",
  title: "Check for Updates",
  style: {
    width: 320,
    height: 240,
  },
  view: function View() {
    const [isLatest, setIsLatest] = useState(true);
    const [isChecking, setIsChecking] = useState(false);

    const refIsChecking = useRef(null);
    refIsChecking.current = isChecking;

    const handleCheckForUpdates = useCallback(async () => {
      const isChecking = refIsChecking.current;

      if (isChecking) {
        return;
      }

      try {
        setIsChecking(true);

        const isLatest = await fetchIsLatestVersion();

        setIsLatest(isLatest);
      } catch (err) {
        console.error(err);
      } finally {
        setIsChecking(false);
      }
    }, []);

    // Automatically check for updates when app starts
    useEffect(() => {
      handleCheckForUpdates();
    }, [handleCheckForUpdates]);

    return (
      <Layout>
        <Content>
          <Center>
            <button onClick={handleCheckForUpdates} disabled={isChecking}>
              Check for Updates
            </button>
            {isLatest ? (
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
            <LabeledLED label="Latest" color={isLatest ? "green" : "red"} />
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default CheckForUpdates;
