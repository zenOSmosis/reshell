const SpeakerAppWindow = {
  id: "speaker-app",
  title: "Speaker.app",
  style: {
    width: 640 * 1.4,
    height: 480 * 1.4,
  },
  view: function View() {
    // TODO: Fix issue where clicking on iframe when not active window does not
    // focus window

    return (
      <iframe
        title="Speaker.app"
        src="https://speaker.app"
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    );
  },
};

export default SpeakerAppWindow;
