import Center from "@components/Center";

import beep from "@utils/beep";

const BeepPrototype = {
  id: "beep",
  title: "Beep",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Center>
        <button onClick={() => beep()}>beep()</button>
      </Center>
    );
  },
};

export default BeepPrototype;
