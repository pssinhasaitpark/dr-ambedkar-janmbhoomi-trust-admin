
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import aboutReducer from "../slice/aboutSlice";
import memorialReducer from "../slice/memorialSlice";
import bookReducer from "../slice/bookSlice";
import eventReducer from "../slice/eventSlice";
import donationReducer from "../slice/donationSlice";
import newsReducer from "../slice/newsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    about: aboutReducer,
    books: bookReducer,
    events: eventReducer,
    donation: donationReducer,
    memorial: memorialReducer,
    news: newsReducer,
},
});

export default store;
