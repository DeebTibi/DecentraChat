import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import React from "react";
import style from "./MiniIdenticon.module.css";

export default function MiniIdenticon({
  username,
  saturation,
  lightness,
  ...props
}) {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return (
    <img className={style.identicon} src={svgURI} alt={username} {...props} />
  );
}
