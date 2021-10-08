import Full from "../Full";

// TODO: Apply module.css styling
export default function ContentArea({ children, ...rest }) {
  return (
    <Full
      style={{
        padding: 8,
      }}
    >
      <Full
        style={{
          border: "1px #868686 solid",
          borderRadius: 4,
          backgroundColor: "rgba(86, 86, 86, .4)",
        }}
      >
        {children}
      </Full>
    </Full>
  );
}
