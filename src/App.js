import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import AboutPage from "./view/pages/About/About";
import BookPage from "./view/pages/Books/Books";
import EventPage from "./view/pages/Event/Event";
import DonationPage from "./view/pages/Donation/Donation";
import Newspage from "./view/pages/News/News";
import GalleryPage from "./view/pages/Gallery/Gallery";
import ContactPage from "./view/pages/Contact/ContactUs";
import BookListPage from "./view/pages/Books/BookList";
import BookDetailsPage from "./view/pages/Books/BookDetails";
import SubscriberPage from "./view/pages/Subscribers/Subscribers";
import TrusteePage from "./view/pages/Trustee/TrusteeRegistration";
import DonationCollectionsPage from "./view/pages/Donation/DonationCollection";
import EventListPage from "./view/pages/Event/EventList";
import NewsListpage from "./view/pages/News/NewsList"
import Login from "./view/pages/Login/Login";
import Sidebar from "./view/components/SideBar/Sidebar";
import Header from "./view/components/Header/AdminHeader";
import { Box } from "@mui/material";
import Home from "./view/pages/Home/Home";
import Dashboard from "./view/pages/Dashboard/Dashboard";
import PrivateRoute from "./view/routes/PrivateRoute";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout";
import AdminProfile from "./view/pages/Profile/Profile";
import TestimonialsPage from "./view/pages/Testimonials/Testimonials";
import SocialMediaPage from "./view/pages/SocialMedia/SocialMedia";

function AppLayout({ children }) {
  const location = useLocation();
  const hideSidebarAndHeader = ["/login", "/signup"].includes(
    location.pathname
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {!hideSidebarAndHeader && <Sidebar />}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {!hideSidebarAndHeader && <Header />}
        <Box sx={{ flexGrow: 1, p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protect all admin routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/Books-and-Publications" element={<BookPage />} />
          <Route path="/Events-&-Celebrations" element={<EventPage />} />
          <Route path="/Donation-and-Support" element={<DonationPage />} />
          <Route path="/home" element={<Home />} />
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
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/socialmedia" element={<SocialMediaPage />} />
          <Route
            path="/donationcollection"
            element={<DonationCollectionsPage />}
          />
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default App;
