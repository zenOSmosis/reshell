import React, { useCallback, useState, useRef } from "react";

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
      alt={alt}
      title={title}
      src={src}
    />
  );
}
