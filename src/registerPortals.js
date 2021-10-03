import React from "react";
import ReShellCore from "./core";

// TODO: Move dayjs functionality into core start
import dayjs from "dayjs";
// Extend day.js w/ fromNow() method
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// The portals defined here are what are selectable inside of the application
const portals = {
  default: React.lazy(() => import("@portals/SpeakerAppPortal")),

  example: React.lazy(() => import("@portals/ExamplePortal")),

  test: React.lazy(() => import("@portals/TestPortal")),
};

ReShellCore.registerPortals(portals);

// TODO: Include ability to parse out an HTML file and dynamically link it to
// the public directory during runtime (and during build) for SEO

// TODO: Enable any application to include about info, metadata, so that they
// can be included in SEO

// TODO: Don't automatically initialize ReShell when a search engine is
// detected (i.e. look for various JS properties a search engine might not
// exhibit and test if those capabilities exist in order to determine if a
// search engine or not)

// TODO: Try to not get too fancy with SEO pages, and keep them mostly HTML,
// with JS assets sprinkled in to be able to open relevant parts of ReShell
// when needed, if it is not automatically initialized
