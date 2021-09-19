import useAppRegistrationLink from "@hooks/useAppRegistrationLink";

// TODO: Document
export default function AppLinkButton({ appDescriptorID, ...rest }) {
  const { title, link } = useAppRegistrationLink(appDescriptorID);

  if (!link) {
    return null;
  }

  return (
    <button onClick={link} {...rest}>
      {title}
    </button>
  );
}
