export default function WindowTitlebarButton({ ...rest }) {
  // TODO: Compose with specific buttons for "green", "yellow", and "red".

  return (
    <button
      style={{
        padding: 0,
        margin: 4,
        borderRadius: 12,
        width: 12,
        height: 12,
        backgroundColor: "#ccc",
      }}
      {...rest}
    ></button>
  );
}
