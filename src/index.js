import reportWebVitals from "./reportWebVitals";

import "./registerPortals";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//
// Additional reading for "name" element:
//  - [FCP] https://web.dev/fcp/
//  - [TTFB] https://web.dev/time-to-first-byte/
//  - [FID] https://web.dev/fid/
//  - [CLS] https://web.dev/cls/
reportWebVitals(({ id, name, value }) => {
  // TODO: Remove
  console.log({
    webVitalsReport: {
      id,
      name,
      value,
    },
  });
});
