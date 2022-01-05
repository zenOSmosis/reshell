// TODO: Document w/ prop-types
export default function ExternalLinkButton({
  href,
  target = "_blank",
  ...rest
}) {
  return (
    <button
      {...rest}
      // TODO: Refactor to useCallback
      onClick={() => window.open(href, target)}
    />
  );
}
