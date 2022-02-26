import { useMemo } from "react";
import useAppRegistrationLink from "@hooks/useAppRegistrationLink";
import ButtonTransparent from "../ButtonTransparent";

import PropTypes from "prop-types";

// FIXME: (jh) Apply "active" class to button whenever registration is active?

AppLinkButton.propTypes = {
  // App descriptor / registration ID
  id: PropTypes.string.isRequired,

  // Optional title override for button link, if wanting to inherit title from
  // app itself
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

  // If there are children, show a non-styled [transparent] button, otherwise,
  // show a standard button
  const ButtonView = useMemo(
    () => props =>
      children ? <ButtonTransparent {...props} /> : <button {...props} />,
    [children]
  );

  // Link might not be available if calling from another portal or if the app
  // descriptor is not currently registered with app registrations
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
