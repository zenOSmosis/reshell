import ReactJson from "react-json-view";

const packageJson = require("../../../../../package.json");

export const REGISTRATION_ID = "software-info";

const SoftwareInfo = {
  id: REGISTRATION_ID,
  title: "Software Info",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <ReactJson
          src={packageJson}
          theme="monokai"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  },
};

export default SoftwareInfo;
