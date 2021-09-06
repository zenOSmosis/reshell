import Desktop from "@components/Desktop";

import AdditionWindow from "./windows/AdditionWindow";
import MultiplicationWindow from "./windows/MultiplicationWindow";
import TotalsWindow from "./windows/TotalsWindow";
import ArbitraryValuesWindow from "./windows/ArbitraryValuesWindow";

export default function WizardPortal() {
  return (
    <Desktop
      appDescriptors={[
        AdditionWindow,
        MultiplicationWindow,
        TotalsWindow,
        ArbitraryValuesWindow,
      ]}
    />
  );
}