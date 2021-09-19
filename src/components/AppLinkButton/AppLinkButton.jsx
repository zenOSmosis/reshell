import useAppRegistrationLink from "@hooks/useAppRegistrationLink";

// TODO: Document
export default function AppLinkButton({ id, title = null, ...rest }) {
  const { title: registrationTitle, link } = useAppRegistrationLink(id);

  if (!link) {
    return null;
  }

  return (
    <button onClick={link} {...rest}>
      {title || registrationTitle}
    </button>
  );
}
