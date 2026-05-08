import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, setToken, logout } = slice.actions;
export default slice.reducer;