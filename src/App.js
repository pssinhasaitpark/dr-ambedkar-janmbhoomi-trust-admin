import "./App.css";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import {
  AboutPage,
  BookPage,
  EventPage,
  DonationPage,
  Newspage,
  GalleryPage,
  ContactPage,
  BookListPage,
  SubscriberPage,
  TrusteePage,
  DonationCollectionsPage,
  EventListPage,
  NewsListpage,
  Login,
  Home,
  Dashboard,
  AdminProfile,
  TestimonialsPage,
  SocialMediaPage,
} from "./view/pages/index";
import Sidebar from "./view/components/SideBar/Sidebar";
import Header from "./view/components/Header/AdminHeader";
import PrivateRoute from "./view/routes/PrivateRoute";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout";

const isTokenExpired = () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  return !tokenExpiry || Date.now() >= Number(tokenExpiry);
};

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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      if (isTokenExpired()) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("tokenExpiry");
        navigate("/login");
      } else {
        setUser({ token });
      }
    } else if (location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  return (
    <AppLayout>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Protect all admin routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
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

        {/* 🔄 Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
