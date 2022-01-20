import Center from "@components/Center";

import beep from "@utils/beep";

const BeepPrototypeApp = {
  id: "beep",
  title: "Beep",
  style: {
    width: 280,
    height: 150,
  },
  view: function View() {
    return (
      <Center>
        <button onClick={() => beep()}>beep()</button>
      </Center>
    );
  },
};

export default BeepPrototypeApp;
