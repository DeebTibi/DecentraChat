import React from "react";
import style from "./ErrorPage.module.css";
export default function ErrorPage({ text, isVisible }) {
  return (
    <>
      {isVisible ? (
        <div className={style.container}>
          <h1 className={style.text}>{text}</h1>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
