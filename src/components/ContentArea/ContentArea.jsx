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
          border: "1px #ccc solid",
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        {children}
      </Full>
    </Full>
  );
}
