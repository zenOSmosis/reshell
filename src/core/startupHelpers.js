// IMPORTANT: This file is included within ReShell core, so it is good practice
// to not include ReShell core as a dependency here

import dayjs from "dayjs";

// Extend day.js w/ fromNow() method
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
