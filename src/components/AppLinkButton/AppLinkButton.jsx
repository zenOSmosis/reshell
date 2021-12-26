import useAppRegistrationLink from "@hooks/useAppRegistrationLink";
import VirtualLinkButton from "../VirtualLinkButton";

import PropTypes from "prop-types";

// TODO: Apply "active" class to button whenever registration is active?

AppLinkButton.propTypes = {
  id: PropTypes.string.isRequired,

  // TODO: Filter to any React component
  icon: PropTypes.func,

  title: PropTypes.string,
};

// TODO: Document
export default function AppLinkButton({
  id,
  icon = null,
  title = null,
  ...rest
}) {
  const { title: registrationTitle, link } = useAppRegistrationLink(id);

  if (!link) {
    return null;
  }

  return (
    <VirtualLinkButton
      // IMPORTANT: ...rest is moved before onClick handler so the internal
      // onClick handler will not be overridden
      {...rest}
      onClick={link}
    >
      {icon || title || registrationTitle}
    </VirtualLinkButton>
  );
}
