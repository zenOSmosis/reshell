import Full from "@components/Full";
import Center from "@components/Center";

import UIModalService from "@services/UIModalService";

const ModalsPrototypeApp = {
  id: "modals-prototype",
  title: "Modals Prototype",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [UIModalService],
  view: function View({ appServices }) {
    const modalService = appServices[UIModalService];

    return (
      <Center>
        <button
          onClick={() =>
            modalService.showModal(({ onClose }) => (
              <Full style={{ backgroundColor: "rgba(0,0,0,.4)" }}>
                <Center>
                  <div>
                    <button onClick={onClose}>Close</button>
                  </div>
                </Center>
              </Full>
            ))
          }
        >
          Generate Test Modal
        </button>
      </Center>
    );
  },
};

export default ModalsPrototypeApp;
