
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
import booklistReducer from "../slice/booklistSlice";
import subscribersReducer from "../slice/subscribersSlice";
import trusteeReducer from "../slice/trusteeSlice";
import donationCollectionReducer from "../slice/donationcollectionSlice";
import eventlistReducer from "../slice/eventlistSlice";
import newslistReducer from "../slice/newslistSlice";
import dashboardReducer from "../slice/dashboardSlice";
import testimonialReducer from "../slice/testimonialSlice";
import socialMediaReducer from "../slice/socialMediaSlice";

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
    booklist: booklistReducer,
    subscribers: subscribersReducer,
    trustee: trusteeReducer,
    donations: donationCollectionReducer,
    eventlist: eventlistReducer,
    newslist: newslistReducer,
    dashboard: dashboardReducer,
    testimonials: testimonialReducer,
    socialMedia: socialMediaReducer,
},
});

export default store;
