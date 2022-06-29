import Padding from "@components/Padding";

export default function NoNetworks({ onCreateNetwork }) {
  return (
    <div style={{ fontWeight: "bold" }}>
      There are currently no public networks to connect to.
      <div>
        <Padding>
          <button onClick={onCreateNetwork}>Create a Network</button>
        </Padding>
      </div>
    </div>
  );
}
