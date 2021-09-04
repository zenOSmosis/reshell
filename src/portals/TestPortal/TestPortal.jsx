import Desktop from "@components/Desktop";

import AdditionWindow from "./windows/AdditionWindow";
import MultiplicationWindow from "./windows/MultiplicationWindow";
import TotalsWindow from "./windows/TotalsWindow";

export default function WizardPortal() {
  return (
    <Desktop
      initialWindows={[AdditionWindow, MultiplicationWindow, TotalsWindow]}
    />
  );
}
