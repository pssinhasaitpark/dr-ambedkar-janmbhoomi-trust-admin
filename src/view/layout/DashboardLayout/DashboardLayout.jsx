import React from "react";
import { Routes, Route } from "react-router-dom";

import AboutPage from "../../pages/About/About";
import BookPage from "../../pages/Books/Books";
import EventPage from "../../pages/Event/Event";
import DonationPage from "../../pages/Donation/Donation";
import Newspage from "../../pages/News/News";
import NewsListpage from "../../pages/News/NewsList";
import GalleryPage from "../../pages/Gallery/Gallery";
import ContactPage from "../../pages/Contact/ContactUs";
import BookListPage from "../../pages/Books/BookList";
import BookDetailsPage from "../../pages/Books/BookDetails";
import SubscriberPage from "../../pages/Subscribers/Subscribers";
import TrusteePage from "../../pages/Trustee/TrusteeRegistration";
import DonationCollectionsPage from "../../pages/Donation/DonationCollection";
import EventListPage from "../../pages/Event/EventList";

import Home from "../../pages/Home/Home";
import Dashboard from "../../pages/Dashboard/Dashboard";
import AdminProfile from "../../pages/Profile/Profile";
const DashboardLayout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="Books-and-Publications" element={<BookPage />} />
        <Route path="Events-&-Celebrations" element={<EventPage />} />
        <Route path="Donation and Support" element={<DonationPage />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/News-&-Updates" element={<Newspage />} />
        <Route path="/newslist" element={<NewsListpage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/Contact-&-Enquiries" element={<ContactPage />} />
        <Route path="/booklist" element={<BookListPage />} />
        <Route path="/bookdetails" element={<BookDetailsPage />} />
        <Route path="/subscriber" element={<SubscriberPage />} />
        <Route path="/trustee" element={<TrusteePage />} />
        <Route path="/eventlist" element={<EventListPage />} />
        <Route path="/donationcollection" element={<DonationCollectionsPage />} />
      </Routes>
    </>
  );
};

export default DashboardLayout;

