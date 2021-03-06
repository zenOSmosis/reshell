import Center from "@components/Center";

const slides = [
  {
    // TODO: Make common component for "ReShell Architecture Benefits"
    view: function View() {
      return (
        <Center>
          <div style={{ fontWeight: "bold" }}>ReShell</div>
        </Center>
      );
    },
  },
  {
    // TODO: Make common component for "ReShell Architecture Benefits"
    view: function View() {
      return (
        <Center>
          <div>
            <div style={{ fontWeight: "bold" }}>ReShell</div>
            <div style={{ marginTop: 20 }}>
              Built on PhantomCore, PhantomCollection, React, and a bunch of
              things from Speaker.app
            </div>
          </div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div>
            <div style={{ fontWeight: "bold" }}>
              Web Browsers are [like] Operating Systems
            </div>
            <div style={{ marginTop: 20 }}>
              <ul>
                <li>
                  <a
                    href="https://emscripten.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Able to run C / C++ / LLVM toolchain
                  </a>
                </li>
                <li>
                  <a
                    href="https://en.wikipedia.org/wiki/Chromium_(web_browser)"
                    target="_blank"
                    rel="noreferrer"
                  >
                    [Chromium is] Mostly written in C++
                  </a>
                </li>
                <li>
                  <a
                    href="https://web.dev/file-system-access"
                    target="_blank"
                    rel="noreferrer"
                  >
                    File System Access
                  </a>
                </li>
                <li>
                  <a
                    href="https://web.dev/usb/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    USB Access
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/6362090?hl=en&co=GENIE.Platform%3DDesktop"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Bluetooth Access
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.techsolutions.support.com/how-to/how-to-create-and-switch-profiles-in-chrome-12564"
                    target="_blank"
                    rel="noreferrer"
                  >
                    User Profiles
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/chromium/chromium/tree/master/media/ffmpeg"
                    target="_blank"
                    rel="noreferrer"
                  >
                    A/V Encoding / Decoding / Transcoding (FFMPEG)
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/chromium/chromium/tree/master/media/gpu"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GPU
                  </a>
                </li>
                <li>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Accelerometer (detect when device is moved)
                  </a>
                </li>
                <li>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API"
                    target="_blank"
                    rel="noreferrer"
                  >
                    OS-level multithreading
                  </a>
                  ... including ability to share memory between processes{" "}
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    (see SharedArrayBuffer)
                  </a>
                </li>
                <li>
                  <a
                    href="https://developer.chrome.com/blog/new-in-chrome-93/#url-handlers"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Installed web applications (PWAs)
                  </a>
                </li>
                <li>
                  <a
                    href="https://developer.chrome.com/blog/new-in-chrome-93/#window-placement"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Multi-screen window placement (control which screen should
                    render fullscreen content)
                  </a>{" "}
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/API/Screen"
                    target="_blank"
                    rel="noreferrer"
                  >
                    (also see Screen API)
                  </a>
                </li>
                <li>
                  Access to hardware devices (i.e. camera / microphone / USB /
                  bluetooth / GPU) with hardware acceleration enabled on most
                  platforms
                </li>
                <li>
                  Network; HTTP / WebSockets / WebRTC (...goes without saying)
                </li>
              </ul>
            </div>
          </div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div>Not to mention, Chrome OS.</div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div>
            <div style={{ fontWeight: "bold" }}>
              Chromebooks outsold Macs worldwide in 2020, cutting into Windows
              market share.
            </div>
            <div style={{ marginTop: 20, fontStyle: "italic" }}>
              Source:{" "}
              <a
                href="https://www.geekwire.com/2021/chromebooks-outsold-macs-worldwide-2020-cutting-windows-market-share/"
                target="_blank"
                rel="noreferrer"
              >
                https://www.geekwire.com/2021/chromebooks-outsold-macs-worldwide-2020-cutting-windows-market-share/
              </a>
            </div>
          </div>
        </Center>
      );
    },
  },
  {
    // TODO: Make common component for "ReShell Architecture Benefits"
    view: function View() {
      return (
        <Center>
          <div style={{ fontWeight: "bold" }}>
            ReShell is a UI bridge which [either completely or partially]
            removes the hard parts of:
          </div>
          <div style={{ marginTop: 20 }}>
            <ul>
              <li>Laying out a fresh application</li>
              <li>Making web apps feel more like native apps</li>
              <li>Setting up prototype UIs for development / demonstration</li>
              <li>State management</li>
              <li>
                Dynamic state linking between components [
                <a
                  href="https://localhost:3010/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Calculator Messaging Demo
                </a>
                ]
              </li>
              <li>
                Cross-platform testing (the core view library is actively tested
                across all major platforms)
              </li>
            </ul>
            <hr />
            <div>
              TLDR: Less boilerplate; it's mostly baked into the core and is
              built on top of React.
            </div>
          </div>
        </Center>
      );
    },
  },
  {
    // TODO: Make common component for "ReShell Architecture Benefits"
    view: function View() {
      return (
        <Center>
          <div style={{ fontWeight: "bold" }}>
            ReShell Architecture Benefits...
          </div>
        </Center>
      );
    },
  },
  {
    // TODO: Make common component for "ReShell Architecture Benefits"
    view: function View() {
      return (
        <Center>
          <div>
            <div style={{ fontWeight: "bold" }}>
              ReShell Architecture Benefits...
            </div>
            <div style={{ marginTop: 20, fontStyle: "italic" }}>
              Key point: Faster UI prototyping
            </div>
          </div>
        </Center>
      );
    },
  },
  {
    // TODO: Make common component for "ReShell Architecture Benefits"
    view: function View() {
      return (
        <Center>
          <div style={{ fontWeight: "bold" }}>
            ReShell Architecture Benefits
          </div>
          <ul>
            <li>
              Mobile / browser inconsistencies debugged in the desktop layer;
              less cross-platform issues to worry about in the application layer
              {
                // TODO: Show a diagram?
              }
            </li>
            <li>
              Better focus on what individual applications should do; less worry
              about layout
            </li>
            <li>
              Better focus on state management between related components, and
              how that information is related
            </li>
            <li>Less state management boilerplate (compared to Redux, etc.)</li>
            <li>
              Many React projects suffer from losing the ability to hot reload
              and maintain state due to the way their state management is wired
              in. ReShell's service architecture retains this ability, by
              design.
            </li>
            <li>
              Dynamic workflows - Users can have which elements they choose at
              any given time on the screen at once, and any related data can be
              synced between those views at the same time
              {
                // TODO: Include link to calculator portal?
              }
            </li>
            <li>
              Improvements to underlying rendering engine and layout affect all
              applications wrapped in ReShell.
            </li>
          </ul>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div style={{ fontWeight: "bold" }}>ReShell Goals...</div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div>
            <div style={{ fontWeight: "bold" }}>ReShell Goals</div>
            <ul>
              <li>
                Remote application streaming from host operating systems to all
                connected peers in a Speaker.app network
              </li>
              <li>
                SEO friendly: Applications wrapped in ReShell, exposed to the
                native web, will be partially indexable by Google / etc.
              </li>
              <li>
                ReShell applications require less imports than conventional
                React-based applications with shared state management.
              </li>
              <li>
                File watcher API around create-react-app will monitor for
                application directory changes within respective portals and
                automatically populate internal application lists as well as
                have application paths exposed to OpenFS.
              </li>
              <li>
                Mac / Windows / Linux etc. environments when connected via
                HostBridge
              </li>
            </ul>
          </div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div style={{ fontStyle: "italic" }}>And everything tested</div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div>
            <div style={{ fontWeight: "bold" }}>
              TODO: Tooling for GitHub Developer Program
            </div>
            <div>
              <p>
                If you build tools that integrate with GitHub, you can join the
                GitHub Developer Program.
              </p>
            </div>
            <div style={{ marginTop: 20 }}>
              <a
                href="https://docs.github.com/en/developers/overview/github-developer-program"
                target="_blank"
                rel="noreferrer"
              >
                https://docs.github.com/en/developers/overview/github-developer-program
              </a>
            </div>
          </div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return <Center>ReShell also has another project name...</Center>;
    },
  },
  {
    view: function View() {
      return <Center>It's called "ESUI"</Center>;
    },
  },
  {
    view: function View() {
      return (
        <Center>
          It's called "ESUI"
          <br />
          It's pronounced "es-wee"
        </Center>
      );
    },
  },
  {
    view: function View() {
      return <Center>ESUI: EcmaScript User Interface</Center>;
    },
  },
  {
    view: function View() {
      return (
        <Center>
          ESUI: EcmaScript User Interface
          <br />
          (it also means "eat" in Latin)
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <Center>
          <div>
            <p>
              ECMAScript is the scripting language that forms the basis of
              JavaScript.
            </p>
            <p style={{ fontStyle: "italic" }}>
              Source:{" "}
              <a
                target="_blanks"
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Resources"
              >
                https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Resources
              </a>
            </p>
          </div>
        </Center>
      );
    },
  },
  /*
  {
    view: function View() {
      return (
        // TODO: Applying notebook paper, or code, view to this would look kind of cool
        <Center>
          {`
            // Maybe we can say, "we built a rendering engine on top of React, so that
            // React components can be used, without the complexity of dealing with React
            // hook dependencies, in order to reduce excessive rendering, or stale states,
            // caused by improper user of hook dependencies".... could also smooth the
            // transition over to Svelte or any other rendering engine for apps created on
            // top of one of them.
            `
            .split("\n")
            .map((line, idx) => (
              <div key={idx} style={{ textAlign: "left" }}>
                {line}
              </div>
            ))}
        </Center>
      );
    },
  }*/ {
    view: function View() {
      return (
        <Center>
          <div>
            <div style={{ fontWeight: "bold" }}>
              The following slide is NOT how Speaker.app will be integrated.
            </div>
            <div style={{ fontStyle: "italic", marginTop: 20 }}>However...</div>
          </div>
        </Center>
      );
    },
  },
  {
    view: function View() {
      return (
        <iframe
          title="Speaker.app"
          src="https://speaker.app"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      );
    },
  },
  {
    view: function View() {
      return (
        <iframe
          title="zenOSmosis"
          src="https://zenOSmosis.com"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      );
    },
  },
  {
    view: function View() {
      return (
        <iframe
          title="ReShell"
          src="/"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      );
    },
  },
  {
    view: function View() {
      return <Center>Thanks for watching!</Center>;
    },
  },
];

export default slides;
