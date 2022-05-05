import "./CRT.css";

// TODO: Borrow ideas from:
//  - https://codesandbox.io/s/crt-terminal-in-css-js-tlijm
//  - https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh

export default function CRT() {
  return (
    // the actual device
    <div id="monitor">
      {
        // the rounded edge near the glass
      }

      <div id="bezel">
        {
          // the overlay and horizontal pattern
        }
        <div
          id="crt"
          className="off"
          // onClick="handleClick(event)"
        >
          {
            // slowly moving scanline
          }
          <div className="scanline"></div>
          {
            // the input and output
          }
          <div className="terminal">This is a terminal</div>
        </div>
      </div>
    </div>
  );
}
