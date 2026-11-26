import { createSlice } from "@reduxjs/toolkit";

/**
 * Only non-sensitive profile info is kept here (for UI). The session itself is an
 * httpOnly cookie the browser JavaScript cannot read; the server is the source of truth.
 */
const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
