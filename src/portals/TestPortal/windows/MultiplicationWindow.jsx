import Center from "@components/Center";

import MultiplicationService from "../services/MultiplicationService";

const MultiplicationWindow = {
  id: "multiplication",
  title: "Multiplication",
  style: {
    right: 0,
    top: 0,
    width: 300,
    height: 300,
  },
  serviceClasses: [MultiplicationService],
  view: function View({ windowController, windowServices }) {
    const multiplier = windowServices[MultiplicationService];

    return (
      <Center>
        <div>
          <div>
            <button onClick={() => multiplier.increment()}>value * 2</button>
          </div>
          <div>value: {multiplier.getValue()}</div>
          <div>
            <button onClick={() => multiplier.reset()}>Reset</button>
          </div>
        </div>
      </Center>
    );
  },
};

export default MultiplicationWindow;
