import IFrame from "@components/IFrame";

const PHANTOM_CORE_DOCS_URL = "https://zenosmosis.github.io/phantom-core/";

export const REGISTRATION_ID = "phantom-core-docs";

const PhantomCoreDocsApp = {
  id: REGISTRATION_ID,
  title: "PhantomCore Docs",
  style: {
    width: 1200,
    height: 960,
  },
  view: function View() {
    return <IFrame src={PHANTOM_CORE_DOCS_URL} />;
  },
};

export default PhantomCoreDocsApp;
