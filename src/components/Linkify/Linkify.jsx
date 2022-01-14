import { useEffect, useMemo, useState } from "react";

import anchorme from "anchorme";
import sanitizeHtml from "sanitize-html";

import PropTypes from "prop-types";

Linkify.propTypes = {
  /** The input string to be sanitized. */
  string: PropTypes.string,
};

/**
 * Adds links to and adds HTML sanitization to the input string.
 */
export default function Linkify({ string, ...rest }) {
  // NOTE: Alternative sanitizer: https://gomakethings.com/how-to-sanitize-html-strings-with-vanilla-js-to-reduce-your-risk-of-xss-attacks/
  string = useMemo(
    () =>
      sanitizeHtml(string, {
        disallowedTagsMode: "recursiveEscape",
      }),
    [string]
  );

  const [linkified, _setLinkified] = useState(string);

  useEffect(() => {
    // @see http://alexcorvi.github.io/anchorme.js/#options
    const linkified = anchorme({
      input: string,

      options: {
        attributes: {
          target: "_blank",
          // class: "detected",
        },
      },
    });

    _setLinkified(linkified);
  }, [string]);

  return <div dangerouslySetInnerHTML={{ __html: linkified }} {...rest} />;
}
