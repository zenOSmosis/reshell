// IMPORTANT: This file is included within ReShell core, so it is good practice
// to not include ReShell core as a dependency here

const dayjs = require("dayjs");

// Extend day.js w/ fromNow() method
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

// Extend day.js w/ localization
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
