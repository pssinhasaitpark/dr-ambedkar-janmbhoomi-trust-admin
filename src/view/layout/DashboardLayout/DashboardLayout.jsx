import React from "react";
import { Routes, Route } from "react-router-dom";

import AboutPage from "../../pages/About/About";
import BookPage from "../../pages/Books/Books";
import EventPage from "../../pages/Event/Event";
import DonationPage from "../../pages/Donation/Donation";
import Newspage from "../../pages/News/News";

import AdminMemorialForm from "../../pages/Home/Home";
import Dashboard from "../../components/Dashboard/Dashboard";
import AdminProfile from "../../pages/Profile/Profile"
const DashboardLayout = () => {
  return (
    <>
      <Routes>
      <Route path="dash" element={<Dashboard />} />
        <Route path="home" element={<AdminMemorialForm />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="event" element={<EventPage />} />
        <Route path="donation" element={<DonationPage />} />
        <Route path="/profile" element={<AdminProfile/>} />
        <Route path="/news" element={<Newspage />} />
      </Routes>
    </>
  );
};

export default DashboardLayout;
