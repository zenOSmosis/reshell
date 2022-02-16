import { useMemo } from "react";
import useAppRegistrationLink from "@hooks/useAppRegistrationLink";
import ButtonTransparent from "../ButtonTransparent";

import PropTypes from "prop-types";

// TODO: Apply "active" class to button whenever registration is active?

AppLinkButton.propTypes = {
  id: PropTypes.string.isRequired,

  title: PropTypes.string,
};

// TODO: Document
export default function AppLinkButton({
  id,
  children = null,
  title = null,
  ...rest
}) {
  const { title: registrationTitle, link } = useAppRegistrationLink(id);

  // If there are children, show a non-styled button, otherwise, show a
  // standard button
  const ButtonView = useMemo(
    () => props =>
      children ? <ButtonTransparent {...props} /> : <button {...props} />,
    [children]
  );

  if (!link) {
    return null;
  }

  return (
    <ButtonView
      // IMPORTANT: ...rest is moved before onClick handler so the internal
      // onClick handler will not be overridden
      {...rest}
      onClick={link}
    >
      {children || title || registrationTitle}
    </ButtonView>
  );
}
