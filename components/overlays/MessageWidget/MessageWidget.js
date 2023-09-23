import React from "react";
import style from "./MessageWidget.module.css";
import { useInView } from "react-intersection-observer";
import MiniIdenticon from "../MiniIdenticon/MiniIdenticon";

export default function MessageWidget({ content, author }) {
  return <Message content={content} author={author} />;
}

function Message({ content, author }) {
  return (
    <div className={style.msg_container}>
      <div className={style.avatar_container}>
        <MiniIdenticon username={author} />
      </div>
      <div className={style.text_container}>
        <h1 className={style.author}>{author}</h1>
        <p className={style.msg}>{content}</p>
      </div>
    </div>
  );
}
