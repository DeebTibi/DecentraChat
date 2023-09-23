import React, { useState } from "react";
import style from "./ChatInput.module.css";

export default function ChatInput({ onSubmit, className }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit(value);
      setValue("");
    }
  };
  return (
    <div className={style.container}>
      <input
        className={`${className} ${style.input}`}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={value}
      ></input>
    </div>
  );
}
