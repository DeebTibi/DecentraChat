import React from "react";
import style from "./ConnectionModa.module.css";
export default function ConnectionModal({ isVisible, text }) {
  return (
    <>
      {isVisible ? (
        <div className={style.container}>
          <div className={style.modal}>
            <h1 className={style.text}>{text}</h1>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
