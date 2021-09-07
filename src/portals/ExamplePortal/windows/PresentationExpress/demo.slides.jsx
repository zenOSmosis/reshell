import Center from "@components/Center";

const slides = [
  {
    view: function View() {
      return <Center>ReShell has another project name</Center>;
    },
  },
  {
    view: function View() {
      return <Center>It's called "ESUI"</Center>;
    },
  },
  {
    view: function View() {
      return (
        <Center>
          It's called "ESUI"
          <br />
          It's pronounced "es-wee"
        </Center>
      );
    },
  },
  {
    view: function View() {
      return <Center>ESUI: EcmaScript User Interface)</Center>;
    },
  },
  {
    view: function View() {
      return (
        <Center>
          ESUI: EcmaScript User Interface)
          <br />
          (it also means "eat" in Latin)
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        // TODO: Applying notebook paper, or code, view to this would look kind of cool
        <Center>
          {`
            // Maybe we can say, "we built a rendering engine on top of React, so that
            // React components can be used, without the complexity of dealing with React
            // hook dependencies, in order to reduce excessive rendering, or stale states,
            // caused by improper user of hook dependencies".... could also smooth the
            // transition over to Svelte or any other rendering engine for apps created on
            // top of one of them.
            `
            .split("\n")
            .map((line, idx) => (
              <div key={idx} style={{ textAlign: "left" }}>
                {line}
              </div>
            ))}
        </Center>
      );
    },
  },
];

export default slides;
