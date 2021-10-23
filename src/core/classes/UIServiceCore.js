import { PhantomServiceCore } from "phantom-core";
const { EVT_UPDATED, EVT_DESTROYED } = PhantomServiceCore;

export { EVT_UPDATED, EVT_DESTROYED };

export default class UIServiceCore extends PhantomServiceCore {}
