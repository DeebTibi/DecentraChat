"use client";
import React, { useEffect, useState } from "react";
import style from "./login.module.css";
import InputForm from "@/components/interactables/InputForm/InputForm";
import Button from "@/components/interactables/Button/Button";
import validator from "validator";
import TTLModal from "@/components/interactables/Modal/TTLModal";
import SERVER_REQUESTS from "@/source/scheme/server_requests";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/overlays/LoadingScreen.js/LoadingScreen";

axios.defaults.baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3100"
    : "https://auth.decentrachat.duckdns.org";

const ERR_MSGS = {
  invalid_email: {
    title: "Invalid Email",
    info: "Please enter a valid email address",
  },
  fill_form: {
    title: "Form Incomplete",
    info: "Please fill out the form",
  },
  server_err: {
    title: "An unexpected error occured",
    info: "Please try again later",
  },
  sign_up_fail: {
    title: "Could not sign up",
    info: "",
  },
};

export default function Page() {
  const [email, setEmail] = useState("");
  const [pwrd, setPwrd] = useState("");
  const [showTTLModal, setShowTTLModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInfo, setModalInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const handleClick = async () => {
    const isEmailValid = validator.isEmail(email);
    if (pwrd == "") {
      printErrMessage(ERR_MSGS.fill_form);
      return;
    }
    if (!isEmailValid) {
      printErrMessage(ERR_MSGS.invalid_email);
      return;
    }
    setLoading(true);
    await getAccess();
    return;
  };

  const getAccess = async () => {
    const requestData = { ...SERVER_REQUESTS.LOGIN };
    requestData.email = email;
    requestData.password = pwrd;
    try {
      const response = await axios.post("/login", requestData, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });

      // Handle the response data as needed
      const { data, type, status, reason } = response.data;
      if (status != 0) {
        setLoading(false);
        printErrMessage({ ...ERR_MSGS.sign_up_fail, info: reason });
        return;
      }
      const { jwt } = data;
      localStorage.setItem("JWT", jwt);
      setLoading(false);
      push("/dashboard");
      return;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      printErrMessage(ERR_MSGS.server_err);
      return;
    }
  };

  const toggleModal = () => {
    setShowTTLModal(true);
  };

  const printErrMessage = (errRef) => {
    const { title, info } = errRef;
    setModalTitle(title);
    setModalInfo(info);
    toggleModal();
  };

  const verifyJWT = async () => {
    const jwt = localStorage.getItem("JWT");
    if (!jwt) return;

    const requestData = {
      jwt,
    };

    try {
      const response = await axios.post("/verify", requestData, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });

      if (response.data.status != 0) return;
      push("/dashboard");
      return;
    } catch (err) {
      console.log("Error sending request" + err);
    }
  };

  useEffect(() => {
    if (!showTTLModal) {
      return;
    }
    // Use setTimeout to update myState after 5 seconds
    const timer = setTimeout(() => {
      setShowTTLModal(false);
    }, 2000); // 5000 milliseconds (5 seconds)

    // Clear the timer if the button is pressed again
    return () => clearTimeout(timer);
  }, [showTTLModal]);

  useEffect(() => {
    verifyJWT();
  }, []);

  return (
    <main className={style.main}>
      <TTLModal text={modalTitle} info={modalInfo} isOpen={showTTLModal} />
      <LoadingScreen isVisible={loading} />
      <a className={style.text}>LOGIN</a>
      <div className={style.form_container}>
        <div className={style.input_container}>
          <InputForm
            placeholder="Email"
            size="medium"
            value={email}
            setValue={setEmail}
            variation={"normal"}
          />
          <InputForm
            placeholder="Password"
            size="medium"
            value={pwrd}
            setValue={setPwrd}
            variation={"normal"}
          />
        </div>
        <div className={style.btn_container}>
          <Button
            isBtn={false}
            onClick={handleClick}
            text={"Login"}
            theme={"btn_inverse"}
            size={"btn_medium"}
          ></Button>
        </div>
      </div>
    </main>
  );
}
