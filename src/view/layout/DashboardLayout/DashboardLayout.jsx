import React from "react";
import { Routes, Route } from "react-router-dom";

import AboutPage from "../../pages/About/About";
import BookPage from "../../pages/Books/Books";
import EventPage from "../../pages/Event/Event";
import DonationPage from "../../pages/Donation/Donation";
import Newspage from "../../pages/News/News";
import GalleryPage from "../../pages/Gallery/Gallery";
import ContactPage from "../../pages/Contact/ContactUs";
import BookListPage from "../../pages/Books/BookList";
import BookDetailsPage from "../../pages/Books/BookDetails";
import SubscriberPage from "../../pages/Subscribers/Subscribers";
import TrusteePage from "../../pages/Trustee/TrusteeRegistration";
import DonationCollectionsPage from "../../pages/Donation/DonationCollection";

import Home from "../../pages/Home/Home";
import Dashboard from "../../pages/Dashboard/Dashboard";
import AdminProfile from "../../pages/Profile/Profile";
const DashboardLayout = () => {
  return (
    <>
      <Routes>
        <Route path="dash" element={<Dashboard />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="event" element={<EventPage />} />
        <Route path="donation" element={<DonationPage />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/news" element={<Newspage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booklist" element={<BookListPage />} />
        <Route path="/bookdetails" element={<BookDetailsPage />} />
        <Route path="/subscriber" element={<SubscriberPage />} />
        <Route path="/trustee" element={<TrusteePage />} />
        <Route path="/donationcollection" element={<DonationCollectionsPage />} />
      </Routes>
    </>
  );
};

export default DashboardLayout;

