import Center from "@components/Center";

import AdditionService from "../services/AdditionService";
import MultiplicationService from "../services/MultiplicationService";

const ArbitraryValuesApp = {
  id: "arbitrary-values",
  title: "Arbitrary Values",
  style: {
    width: 300,
    height: 300,
  },
  serviceClasses: [AdditionService, MultiplicationService],
  view: function View({ /* windowController, */ appServices }) {
    const adder = appServices[AdditionService];
    const multiplier = appServices[MultiplicationService];

    return (
      <Center>
        <div>
          <div>
            <label>Adder</label>
            <input
              type="number"
              value={adder.getValue()}
              onChange={evt => adder.setValue(evt.target.value)}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <label>Multiplier</label>
            <input
              type="number"
              value={multiplier.getValue()}
              onChange={evt => multiplier.setValue(evt.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => {
                adder.reset();
                multiplier.reset();
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </Center>
    );
  },
};

export default ArbitraryValuesApp;
