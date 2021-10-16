import VirtualLinkButton from "../VirtualLinkButton";

// TODO: Document w/ prop-types
export default function ExternalLinkButton({
  href,
  target = "_blank",
  ...rest
}) {
  return (
    <VirtualLinkButton
      {...rest}
      // TODO: Refactor to useCallback
      onClick={() => window.open(href, target)}
    />
  );
}
