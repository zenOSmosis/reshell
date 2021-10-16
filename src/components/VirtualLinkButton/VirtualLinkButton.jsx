/**
 * NOTE: Fake links need to be a button, so this button is designed to look
 * like a real link, for the most part.
 */
export default function VirtualLinkButton({
  children,
  className,
  onClick,
  ...rest
}) {
  return (
    <button {...rest} onClick={onClick}>
      {children}
    </button>
  );
}
