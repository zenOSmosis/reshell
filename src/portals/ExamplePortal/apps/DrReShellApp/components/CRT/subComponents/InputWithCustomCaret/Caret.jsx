export default function Caret({ hPosition }) {
  // TODO: Make this blink (w/ CSS)
  return (
    <div
      style={{
        position: "absolute",
        left: hPosition / 2.5 + "em",
        top: 0,
        pointerEvents: "none",
      }}
    >
      ■
    </div>
  );
}
