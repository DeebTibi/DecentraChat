"use client";
import React, { useEffect, useState } from "react";
import style from "./signup.module.css";
import InputForm from "@/components/interactables/InputForm/InputForm";
import Button from "@/components/interactables/Button/Button";
import validator from "validator";
import TTLModal from "@/components/interactables/Modal/TTLModal";
import SERVER_REQUESTS from "@/source/scheme/server_requests";
import SERVER_RESPONSE from "@/source/scheme/server_response";
import ConnectionModal from "@/components/interactables/Modal/ConnectionModal";
import { useRouter } from "next/navigation";

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
};

let socket = null;

export default function Page() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwrd, setPwrd] = useState("");
  const [showTTLModal, setShowTTLModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInfo, setModalInfo] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(true);
  const { push } = useRouter();

  const handleClick = () => {
    const isEmailValid = validator.isEmail(email);
    if (userName == "" || pwrd == "") {
      printErrMessage(ERR_MSGS.fill_form);
      return;
    }
    if (!isEmailValid) {
      printErrMessage(ERR_MSGS.invalid_email);
      return;
    }
    get_access();
    return;
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

  const connectToWebsocket = () => {
    // WebSocket event listeners
    const ip = process.env.NEXT_PUBLIC_PUBLIC_ENDPOINT;
    const port = process.env.NEXT_PUBLIC_PORT;
    const env = process.env.NODE_ENV;
    const url =
      env == "development" ? `wss://localhost:${port}` : `wss://${ip}:${port}`;
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      setConnectionStatus(true);
      get_access_with_session();
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const data = JSON.parse(event.data);
      if (
        data["type"] != SERVER_RESPONSE.AUTH &&
        data["type"] != SERVER_RESPONSE.SIGNUP
      ) {
        printErrMessage(ERR_MSGS.server_err);
        return;
      }
      if (data["status"] != 0) {
        printErrMessage(ERR_MSGS.server_err);
        return;
      }

      if (data["type"] == SERVER_RESPONSE.SIGNUP) {
        const session = data["data"]["session"];
        localStorage.setItem("user_session", session);
        localStorage.setItem("user_email", data["data"]["email"]);
        localStorage.setItem("user_name", data["data"]["name"]);
        push("/dashboard");
        return;
      }

      if (data["type"] == SERVER_RESPONSE.AUTH) {
        push("/dashboard");
        return;
      }
      console.log("Sign up was sucessful");
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      setConnectionStatus(false);

      // Handle WebSocket closure, you can add a reconnect logic here if needed
      console.log("reconnecting");
      setTimeout(connectToWebsocket, 5000);
    };

    return () => {
      socket.close();
    };
  };

  const get_access_with_session = () => {
    const session = localStorage.getItem("user_session");
    const user_name = localStorage.getItem("user_name");
    const user_email = localStorage.getItem("user_email");
    if (!session) {
      return;
    }
    let request = { ...SERVER_REQUESTS.SESSION_VALIDATE };
    request.session = session;
    request.name = user_name;
    request.email = user_email;
    socket.send(JSON.stringify(request));
    return;
  };
  const get_access = () => {
    let request = { ...SERVER_REQUESTS.LOGIN };
    request.email = email;
    request.name = userName;
    request.password = "some password";
    socket.send(JSON.stringify(request));
  };

  useEffect(() => {
    connectToWebsocket();
  }, []);

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

  return (
    <main className={style.main}>
      <TTLModal text={modalTitle} info={modalInfo} isOpen={showTTLModal} />
      <ConnectionModal text={"Reconnecting..."} isVisible={!connectionStatus} />
      <a className={style.text}>SIGN UP</a>
      <div className={style.form_container}>
        <div className={style.helper_text}>
          Before we begin, you need to create an account.
        </div>
        <div className={style.input_container}>
          <InputForm
            placeholder="User Name"
            size="medium"
            value={userName}
            setValue={setUsername}
            variation={"normal"}
          />
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
            text={"Sign Up"}
            theme={"btn_inverse"}
            size={"btn_medium"}
          ></Button>
        </div>
      </div>
    </main>
  );
}
