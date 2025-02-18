import React from "react";
import { Routes, Route } from "react-router-dom";

import AboutPage from "../../pages/About/About";
import BookPage from "../../pages/Books/Books";
import EventPage from "../../pages/Event/Event";
import DonationPage from "../../pages/Donation/Donation";

import AdminMemorialForm from "../../pages/Home/Home";
import Dashboard from "../../components/Dashboard/Dashboard";

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
      </Routes>
    </>
  );
};

export default DashboardLayout;
