import React from "react";
import style from "./Button.module.css";
import Link from "next/link";

export default function Button({
  text,
  location = "",
  onClick,
  isBtn,
  theme,
  size,
}) {
  return (
    <>
      {isBtn ? (
        <button
          className={`${style.btn} ${style[size]} ${style[theme]}`}
          onClick={onClick}
        >
          {text}
        </button>
      ) : (
        <Link
          onClick={onClick}
          href={location}
          className={`${style.btn} ${style[size]} ${style[theme]}`}
        >
          {text}
        </Link>
      )}
    </>
  );
}
