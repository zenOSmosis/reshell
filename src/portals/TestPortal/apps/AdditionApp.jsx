import Center from "@components/Center";

import AdditionService from "../services/AdditionService";

const AdditionApp = {
  id: "addition",
  title: "Addition",
  style: {
    width: 300,
    height: 300,
  },
  serviceClasses: [AdditionService],
  view: function View({ /* windowController, */ appServices }) {
    const adder = appServices[AdditionService];

    return (
      <Center>
        <div>
          <div>
            <button onClick={() => adder.increment()}>value + 1</button>
          </div>
          <div>Value: {adder.getValue()}</div>
          <div>
            <button onClick={() => adder.reset()}>Reset</button>
          </div>
        </div>
      </Center>
    );
  },
};

export default AdditionApp;
