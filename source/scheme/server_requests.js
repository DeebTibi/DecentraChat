const SERVER_REQUESTS = {
  LOGIN: {
    email: "",
    password: "",
  },
  SIGNUP: {
    name: "",
    email: "",
    password: "",
  },
  GET_USER_CHATS: {
    type: "get_user_chats",
  },
  SEND_MESSAGE: {
    type: "send_message",
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
  },
  SESSION_VALIDATE: {
    type: "session_validate",
    session: "",
  },
};

export default SERVER_REQUESTS;
