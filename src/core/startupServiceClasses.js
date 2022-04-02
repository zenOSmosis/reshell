/**
 * This file contains optional startup classes which are not required to start
 * up the desktop itself, but help augment some of its control functions.
 */

import NativeSpyService from "@services/NativeSpyService";

const STARTUP_SERVICE_CLASSES = [NativeSpyService];

export default STARTUP_SERVICE_CLASSES;
