"use client";
import ErrorPage from "@/components/overlays/ErrorPage/ErrorPage";
import LoadingScreen from "@/components/overlays/LoadingScreen.js/LoadingScreen";
import SERVER_REQUESTS from "@/source/scheme/server_requests";
import SERVER_RESPONSE from "@/source/scheme/server_response";
import React, { useEffect, useState } from "react";
import style from "./dashboard.module.css";
import ChatWidget from "@/components/interactables/ChatWidget/ChatWidget";
import Button from "@/components/interactables/Button/Button";
import AddChat from "@/components/interactables/AddChat/AddChat";
import CHAT_MODES from "@/source/scheme/chat_modes";
import TTLModal from "@/components/interactables/Modal/TTLModal";

let socket;
let activeChat = {};
const MODAL_MESSAGES = {
  operation_success: "Your request was successful",
  operation_fail: "An error occured",
};
export default function page() {
  const [isAuth, setIsAuth] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [user_name, setName] = useState("");
  const [user_email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [displayMode, setDisplayMode] = useState(CHAT_MODES.NONE);
  const [popUpModalTxt, setPopUpModalTxt] = useState("");
  const [popUpModalState, setPopUpModalState] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    connectWebsocket();
  }, []);

  useEffect(() => {
    if (!popUpModalState) {
      return;
    }
    // Use setTimeout to update myState after 5 seconds
    const timer = setTimeout(() => {
      setPopUpModalState(false);
    }, 2000); // 5000 milliseconds (5 seconds)

    // Clear the timer if the button is pressed again
    return () => clearTimeout(timer);
  }, [popUpModalState]);

  useEffect(() => {
    if (!isConnected || !user_email || !user_name) return;
    setLoading(true);
    if (chats.length == 0) {
      requestChats();
    }
    setLoading(false);
  }, [isConnected, user_email, user_name]);

  const pushModalMessage = (msg) => {
    setPopUpModalTxt(msg);
    setPopUpModalState(true);
  };

  const onCreateChatClick = () => {
    setDisplayMode(CHAT_MODES.CREATE);
  };

  const onJoinChatClick = () => {
    setDisplayMode(CHAT_MODES.JOIN);
  };

  const sendMessage = (content) => {
    const chatName = activeChat.name;
    const chatId = activeChat.id;
    const request = { ...SERVER_REQUESTS.SEND_MESSAGE };
    request.group_id = chatId;
    request.group_name = chatName;
    request.content = content;
    request.user_name = localStorage.getItem("user_name");
    socket.send(JSON.stringify(request));
  };

  const joinChat = (chatName, chatId) => {
    const request = { ...SERVER_REQUESTS.JOIN_GROUP };
    request.email = localStorage.getItem("user_email");
    request.name = localStorage.getItem("user_name");
    request.group_name = chatName;
    request.group_id = chatId;
    socket.send(JSON.stringify(request));
  };

  const createChat = (chatName) => {
    const request = { ...SERVER_REQUESTS.CREATE_GROUP };
    request.group_description = "an experimental group";
    request.group_name = chatName;
    request.email = localStorage.getItem("user_email");
    request.name = localStorage.getItem("user_name");
    socket.send(JSON.stringify(request));
  };

  const requestChats = () => {
    if (!isConnected) return;
    let request = { ...SERVER_REQUESTS.GET_USER_CHATS };
    request.email = user_email;
    request.name = user_name;
    socket.send(JSON.stringify(request));
  };

  const requestMessages = (chatName, chatId) => {
    let request = { ...SERVER_REQUESTS.GET_MISSED_MESSAGES };
    request.group_id = chatId;
    request.group_name = chatName;
    socket.send(JSON.stringify(request));
    return;
  };

  const handleMessages = (data) => {
    // switch the mode
    // save messages
    const msgs = data.data.messages;
    const res = [];
    for (let i = 0; i < msgs.length; i++) {
      res.push({
        author: msgs[i].author,
        content: msgs[i].content,
        id: msgs[i].id,
      });
    }
    setChatMessages(res);
    setDisplayMode(CHAT_MODES.VIEW);
  };

  const displayChat = (chat_name, chat_id) => {
    activeChat = {
      id: chat_id,
      name: chat_name,
    };
    requestMessages(chat_name, chat_id);
  };

  function displayChats() {
    //console.log(chats);
    if (chats.length == 0) return <></>;
    return chats.map((item) => {
      return (
        <ChatWidget
          name={item.name}
          onClick={() => {
            displayChat(item.name, item.id);
          }}
          key={item.id}
        />
      );
    });
  }

  const parseChats = (data) => {
    let chats = data["data"]["chats"];
    let res = [];
    chats.forEach((item) => {
      res.push({
        id: item.id,
        name: item.name,
      });
    });
    setChats((prev) => res);
  };

  const connectWebsocket = () => {
    const ip = process.env.NEXT_PUBLIC_PUBLIC_ENDPOINT;
    const port = process.env.NEXT_PUBLIC_PORT;
    const env = process.env.NODE_ENV;
    const url =
      env == "development" ? `ws://localhost:${port}` : `ws://${ip}:${port}`;
    socket = new WebSocket(url);
    socket.onopen = () => {
      console.log("connection opened");
      setIsConnected(true);
      const email = localStorage.getItem("user_email");
      const name = localStorage.getItem("user_name");
      setEmail(email);
      setName(name);
      requestAuth();
    };

    socket.onmessage = (event) => {
      const encoded_data = event.data;
      console.log("Message received from server: " + encoded_data);
      const data = JSON.parse(encoded_data);

      if (data.type == SERVER_RESPONSE.AUTH) confirmAuth(data);
      if (data.type == SERVER_RESPONSE.USR_CHATS) parseChats(data);
      if (data.type == SERVER_RESPONSE.USR_MSG) {
        const group_id = data["data"]["group_id"];
        if (group_id != activeChat.id) return;
        const msg = {
          author: data["data"]["author"],
          content: data["data"]["content"],
          id: data["data"]["message_id"],
        };
        setChatMessages((prev) => [...prev, msg]);
      }
      if (data.type == SERVER_RESPONSE.CREATE_GROUP) {
        if (data.status != 0) return;
        const new_chat = {
          id: data["data"]["group_id"],
          name: data["data"]["group_name"],
        };
        setChats((prev) => [...prev, new_chat]);
        pushModalMessage(MODAL_MESSAGES.operation_success);
      }
      if (data.type == SERVER_RESPONSE.JOIN_GROUP) {
        if (data.status != 0) return;
        const new_chat = {
          id: data["data"]["group_id"],
          name: data["data"]["group_name"],
        };
        setChats((prev) => [...prev, new_chat]);
        pushModalMessage(MODAL_MESSAGES.operation_success);
      }
      if (data.type == SERVER_RESPONSE.GET_LOST_MESSAGES) handleMessages(data);
    };

    socket.onclose = (event) => {
      console.log("Connection was closed: " + event.wasClean);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  };

  const requestAuth = () => {
    if (!socket) return;
    const session = localStorage.getItem("user_session");
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    if (!session || !email || !name) {
      return;
    }
    let request = { ...SERVER_REQUESTS.SESSION_VALIDATE };
    request.name = name;
    request.email = email;
    request.session = session;
    const payload = JSON.stringify(request);
    socket.send(payload);
  };

  const confirmAuth = (data) => {
    if (!data) return;
    const status = data.status;
    if (status != 0) {
      setLoading(false);
      socket.close();
      return;
    }
    console.log("Authentication successful");
    setIsAuth(true);
  };

  return (
    <div className={style.container}>
      <TTLModal text={popUpModalTxt} isOpen={popUpModalState} info={""} />
      <LoadingScreen isVisible={loading} />
      <ErrorPage
        isVisible={!loading && !isAuth}
        text={"Access to this page is denied."}
      />
      <div className={style.chat_interface}>
        <AddChat
          mode={displayMode}
          onCreate={createChat}
          onJoin={joinChat}
          messages={chatMessages}
          sendMessage={sendMessage}
          chat_id={activeChat.id}
        />
      </div>
      <div className={style.chat_choice}>
        <div className={style.create_chat}>
          <Button
            isBtn={true}
            size={"btn_medium"}
            theme={"btn_main"}
            text={"Join Chat"}
            onClick={onJoinChatClick}
          />
          <Button
            isBtn={true}
            size={"btn_medium"}
            theme={"btn_main"}
            text={"Create Chat"}
            onClick={onCreateChatClick}
          />
        </div>
        <div className={style.chat_widgets}>
          {chats ? displayChats() : <></>}
        </div>
      </div>
    </div>
  );
}
