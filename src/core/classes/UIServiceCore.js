import { PhantomServiceCore } from "phantom-core";
const { EVT_UPDATED, EVT_DESTROYED } = PhantomServiceCore;

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Document
export default class UIServiceCore extends PhantomServiceCore {
  // TODO: Check if we're running in UI thread?
}
