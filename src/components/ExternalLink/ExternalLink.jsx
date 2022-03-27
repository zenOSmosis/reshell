// TODO: Document w/ prop-types
export default function ExternalLink({
  children,
  target = "_blank",
  rel = "noreferrer",
  ...rest
}) {
  return (
    <a {...rest} target={target} rel={rel}>
      {children}
    </a>
  );
}
