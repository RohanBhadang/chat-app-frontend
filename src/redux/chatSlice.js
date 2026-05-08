import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  selectedUser: null,
  chatId: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    setChatId: (state, action) => {
      state.chatId = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    // 🔥 THIS IS IMPORTANT (REALTIME ADD MESSAGE)
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const {
  setUsers,
  setSelectedUser,
  setChatId,
  setMessages,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;