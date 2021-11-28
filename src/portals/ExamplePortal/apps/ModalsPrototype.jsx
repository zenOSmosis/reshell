import Center from "@components/Center";

import UIModalService from "@services/UIModalService";

const ModalsPrototype = {
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
            modalService.showModal({
              view: () => <div>Test Modal</div>,
            })
          }
        >
          Generate Test Modal
        </button>
      </Center>
    );
  },
};

export default ModalsPrototype;
