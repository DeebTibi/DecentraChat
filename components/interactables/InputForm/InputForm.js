import React from "react";
import style from "./InputForm.module.css";
export default function InputForm({
  variation,
  size,
  placeholder,
  value,
  setValue,
}) {
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className={style.container}>
      <a className={style[`text_${size}`]}>{placeholder}</a>
      <input
        className={`${style.input} ${style[`input_${size}`]} ${
          style[`input_${variation}`]
        }`}
        value={value}
        onChange={handleChange}
      ></input>
    </div>
  );
}
