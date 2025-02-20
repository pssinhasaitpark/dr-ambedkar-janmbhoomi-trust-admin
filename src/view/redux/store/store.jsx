
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import aboutReducer from "../slice/aboutSlice";
import memorialReducer from "../slice/memorialSlice";
import bookReducer from "../slice/bookSlice";
import eventReducer from "../slice/eventSlice";
import donationReducer from "../slice/donationSlice";
import newsReducer from "../slice/newsSlice";
import galleryReducer from "../slice/gallerySlice";
import profileReducer from "../slice/profileSlice";
import contactReducer from "../slice/contactSlice";
import homeReducer from "../slice/homeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    about: aboutReducer,
    books: bookReducer,
    events: eventReducer,
    donation: donationReducer,
    memorial: memorialReducer,
    news: newsReducer,
    gallery:galleryReducer,
    profile: profileReducer,
    contact: contactReducer,
    home: homeReducer,
},
});

export default store;
