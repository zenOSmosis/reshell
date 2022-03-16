import Full from "@components/Full";
import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import MesaFooter from "../../components/Footer";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as KEY_VAULT_REGISTRATION_ID } from "@portals/ExamplePortal/apps/KeyVaultApp";

// TODO: Document
// TODO: Add prop-types
export default function WithoutRecognizer({
  speechRecognizerService,
  hasCachedSubscriptionKey,
  subscriptionKeyManagementService,
}) {
  return (
    <Layout>
      <Content>
        <Padding>
          <Layout>
            <Content>
              <Full style={{ overflowY: "auto" }}>
                <Padding>
                  <Padding
                    style={{
                      textAlign: "center",
                      borderRadius: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px rgba(255, 255, 255, 0.2) solid",
                    }}
                  >
                    <Center canOverflow={true}>
                      <div>
                        <button
                          onClick={speechRecognizerService.startRecognizing}
                          style={{
                            // TODO: Use color variable for highlighted elements
                            backgroundColor: "#347fe8",
                          }}
                        >
                          Enable Speech Recognition
                        </button>{" "}
                        in order to control ReShell's desktop.
                      </div>

                      <hr style={{ width: "90%", marginTop: 20 }} />

                      {!hasCachedSubscriptionKey ? (
                        <>
                          <p>
                            You will be prompted to enter a Microsoft Azure
                            Subscription Key in order to use this functionality.
                          </p>
                          <p>
                            The Azure Subscription Key will be stored in local
                            storage, accessible via the{" "}
                            <AppLinkButton id={KEY_VAULT_REGISTRATION_ID} />.
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontWeight: "bold" }}>
                            There is a cached Azure Subscription Key in local
                            storage.
                          </p>

                          <p>
                            <button
                              onClick={
                                subscriptionKeyManagementService.deleteCachedSubscriptionKey
                              }
                              style={{ backgroundColor: "red" }}
                              disabled={!hasCachedSubscriptionKey}
                            >
                              Delete Cached Subscription Key
                            </button>{" "}
                            or open{" "}
                            <AppLinkButton id={KEY_VAULT_REGISTRATION_ID} /> to
                            manage your keys.
                          </p>
                        </>
                      )}
                    </Center>
                  </Padding>
                </Padding>
              </Full>
            </Content>
            <Footer>
              <Center></Center>
            </Footer>
          </Layout>
        </Padding>
      </Content>
      <MesaFooter />
    </Layout>
  );
}
