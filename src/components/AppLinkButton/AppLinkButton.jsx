import useAppRegistrationLink from "@hooks/useAppRegistrationLink";

// TODO: Apply "active" class to button whenever registration is active?

// TODO: Document
export default function AppLinkButton({ id, title = null, ...rest }) {
  const { title: registrationTitle, link } = useAppRegistrationLink(id);

  if (!link) {
    return null;
  }

  return (
    <button
      // IMPORTANT: ...rest is moved before onClick handler so the internal
      // onClick handler will not be overridden
      {...rest}
      onClick={link}
    >
      {title || registrationTitle}
    </button>
  );
}
