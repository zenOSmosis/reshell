import React, { useCallback, useState, useRef } from "react";

import styles from "./Image.module.css";
import classNames from "classnames";

export default function Image({
  alt = "",
  title = "",
  src,
  onLoad = ref => null,
  ...rest
}) {
  const [img, setImg] = useState(null);

  const refOnLoad = useRef(onLoad);

  const handleLoad = useCallback(() => {
    const onLoad = refOnLoad.current;

    onLoad(img);
  }, [img]);

  return (
    <img
      ref={setImg}
      {...rest}
      onLoad={handleLoad}
      className={classNames(styles["image"])}
      alt={alt}
      title={title}
      src={src}
    />
  );
}
