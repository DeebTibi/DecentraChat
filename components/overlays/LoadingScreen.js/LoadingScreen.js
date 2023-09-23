import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lotties/loading.json";
import style from "./LoadingScreen.module.css";
export default function LoadingScreen({ isVisible }) {
  return (
    <>
      {isVisible ? (
        <div className={style.container}>
          <div className={style.lottie_container}>
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              autoplay={true}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
