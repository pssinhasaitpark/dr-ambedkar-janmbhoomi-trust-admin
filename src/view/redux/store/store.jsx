
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import aboutReducer from "../slice/aboutSlice";
import memorialReducer from "../slice/memorialSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    about: aboutReducer,
    memorial: memorialReducer,
},
});

export default store;
