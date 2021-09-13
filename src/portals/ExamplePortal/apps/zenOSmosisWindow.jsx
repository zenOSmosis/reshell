const ZenOSmosisWindow = {
  id: "zenOSmosis",
  title: "zenOSmosis",
  style: {
    left: "auto",
    bottom: 0,
    width: 640 * 1.4,
    height: 480 * 1.4,
  },
  view: function View() {
    // TODO: Fix issue where clicking on iframe when not active window does not
    // focus window

    return (
      <iframe
        title="zenOSmosis"
        src="https://zenOSmosis.com"
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    );
  },
};

export default ZenOSmosisWindow;
