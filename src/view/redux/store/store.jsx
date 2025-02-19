
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import aboutReducer from "../slice/aboutSlice";
import memorialReducer from "../slice/memorialSlice";
import bookReducer from "../slice/bookSlice";
import eventReducer from "../slice/eventSlice";
import donationReducer from "../slice/donationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    about: aboutReducer,
    books: bookReducer,
    event: eventReducer,
    donation: donationReducer,
    memorial: memorialReducer,
},
});

export default store;
