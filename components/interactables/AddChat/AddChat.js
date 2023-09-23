import React, { useEffect, useState } from "react";
import InputForm from "../InputForm/InputForm";
import style from "./AddChat.module.css";
import Button from "../Button/Button";
import MessageWidget from "@/components/overlays/MessageWidget/MessageWidget";
import InfiniteScroll from "react-infinite-scroller";
import CHAT_MODES from "@/source/scheme/chat_modes";
import ChatInput from "../ChatInput/ChatInput";

export default function AddChat({
  mode,
  onCreate,
  onJoin,
  messages,
  sendMessage,
  chat_id,
}) {
  function renderMode() {
    if (mode == CHAT_MODES.CREATE) {
      return <CreateChat onCreate={onCreate} />;
    }
    if (mode == CHAT_MODES.JOIN) {
      return <JoinChat onJoin={onJoin} />;
    }
    if (mode == CHAT_MODES.VIEW) {
      return (
        <ChatDisplay
          messages={messages}
          onSubmit={sendMessage}
          chat_id={chat_id}
        />
      );
    }
    return <></>;
  }

  return <div className={style.container}>{renderMode()}</div>;
}

function ChatDisplay({ messages, onSubmit, chat_id }) {
  return (
    <>
      <div className={style.chat_id}>{chat_id}</div>
      <div className={style.inf_scroll}>
        {messages.map((item, index) => (
          <MessageWidget
            author={item.author}
            content={item.content}
            key={item.id}
          />
        ))}
      </div>
      <ChatInput onSubmit={onSubmit} className={""} />
    </>
  );
}

function JoinChat({ onJoin }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const createChat = () => {
    onJoin(name, id);
  };
  return (
    <div className={style.add_chat_container}>
      <InputForm
        placeholder={"Enter Chat ID"}
        size={"medium"}
        variation={"normal"}
        setValue={setId}
        value={id}
      />
      <InputForm
        placeholder={"Enter Chat Name"}
        size={"medium"}
        variation={"normal"}
        setValue={setName}
        value={name}
      />
      <Button
        isBtn={true}
        size={"btn_medium"}
        text={"Join"}
        theme={"btn_inverse"}
        onClick={createChat}
      />
    </div>
  );
}

function CreateChat({ onCreate }) {
  const [name, setName] = useState("");

  const createChat = () => {
    onCreate(name);
  };
  return (
    <div className={style.add_chat_container}>
      <InputForm
        placeholder={"Enter Chat Name"}
        size={"medium"}
        variation={"normal"}
        setValue={setName}
        value={name}
      />
      <Button
        isBtn={true}
        size={"btn_medium"}
        text={"Create"}
        theme={"btn_inverse"}
        onClick={createChat}
      />
    </div>
  );
}
