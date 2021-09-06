const SpeakerAppWindow = {
  id: "speaker-app",
  title: "Speaker.app",
  style: {
    left: "auto",
    bottom: 0,
    width: 640 * 1.4,
    height: 480 * 1.4,
  },
  view: function View() {
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
