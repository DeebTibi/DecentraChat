const SERVER_REQUESTS = {
  LOGIN: {
    type: "login",
    name: "",
    email: "",
    password: "",
  },
  GET_USER_CHATS: {
    type: "get_user_chats",
    name: "",
    email: "",
  },
  SEND_MESSAGE: {
    type: "send_message",
    user_name: "",
    content: "",
    group_name: "",
    group_id: "",
  },
  GET_USERS_IN_CHAT: {
    type: "get_users_in_chat",
    group_name: "",
    group_id: "",
  },
  CREATE_GROUP: {
    type: "create_group",
    group_name: "",
    group_description: "",
    email: "",
    name: "",
  },
  GET_MISSED_MESSAGES: {
    type: "get_missed_messages",
    group_id: "",
    group_name: "",
  },
  JOIN_GROUP: {
    type: "join_group",
    group_id: "",
    group_name: "",
    name: "",
    email: "",
  },
  SESSION_VALIDATE: {
    type: "session_validate",
    name: "",
    email: "",
    session: "",
  },
};

export default SERVER_REQUESTS;
