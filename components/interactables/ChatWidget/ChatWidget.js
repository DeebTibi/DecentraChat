import React, { useMemo } from "react";
import MiniIdenticon from "@/components/overlays/MiniIdenticon/MiniIdenticon";
import style from "./ChatWidget.module.css";
export default function ChatWidget({ name, onClick }) {
  return (
    <div onClick={onClick} className={style.bar}>
      <div className={style.avatar}>
        <MiniIdenticon saturation={90} username={name} />
      </div>
      <h1 className={style.title}>{name}</h1>
    </div>
  );
}
