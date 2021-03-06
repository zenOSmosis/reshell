import { useEffect } from "react";

import Center from "@components/Center";

// import SocketIOService from "../services/SocketIOService";
// import SocketAPIMockService from "../services/SocketAPIMockService";
// import HostBridgeAPIMockService from "../services/HostBridgeAPIMockService";

import AdditionService from "../services/AdditionService";
import MultiplicationService from "../services/MultiplicationService";

const TotalsApp = {
  id: "totals",
  title: "Totals",
  style: {
    width: 300,
    height: 300,
  },
  serviceClasses: [AdditionService, MultiplicationService],
  view: function View({ windowController, appServices }) {
    const adder = appServices[AdditionService];
    const multiplier = appServices[MultiplicationService];

    // TODO: Remove
    useEffect(() => {
      console.log("rendered use effect");

      return () => console.log("unmount");
    }, []);

    return (
      <Center>
        <div>
          <div>Addition value: {adder.getValue()}</div>
          <div>Multiplication value: {multiplier.getValue()}</div>

          <hr />

          <div>
            Sum (adder + multiplier): {adder.getValue() + multiplier.getValue()}
          </div>
          <div>
            Product (adder x multipler):{" "}
            {adder.getValue() * multiplier.getValue()}
          </div>
        </div>
      </Center>
    );
  },
};

export default TotalsApp;
