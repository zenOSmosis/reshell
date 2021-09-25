import Box3D from "@components/Box3D";
import Center from "@components/Center";

const Box3DPrototype = {
  id: "box3d-prototype",
  title: "Box3D Prototype",
  style: {
    width: 640,
    height: 400,
  },
  // serviceClasses: [],
  view: function View({ windowController, windowServices }) {
    return (
      <Center>
        <Box3D />
      </Center>
    );
  },
};

export default Box3DPrototype;
