export default function ExternalLink({ children, target = "_blank", ...rest }) {
  return (
    <a {...rest} target={target}>
      {children}
    </a>
  );
}
