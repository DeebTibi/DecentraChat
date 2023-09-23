import React from "react";
import style from "./TTLModal.module.css";
export default function TTLModal({ isOpen, text, info }) {
  return (
    <>
      {isOpen ? (
        <div className={style.container}>
          <div className={style.title_container}>
            <h1 className={style.title}>{text}</h1>
          </div>
          <div className={style.info_container}>
            <p className={style.info}>{info}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
