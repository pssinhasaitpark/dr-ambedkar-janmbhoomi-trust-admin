import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import AboutPage from "./view/pages/About/About";
import BookPage from "./view/pages/Books/Books";
import EventPage from "./view/pages/Event/Event";
import DonationPage from "./view/pages/Donation/Donation";
import Newspage from "./view/pages/News/News";

import Login from "./view/pages/Login/Login";
import Sidebar from "./view/components/SideBar/Sidebar";
import Header from "./view/components/Header/AdminHeader";
import { Box } from "@mui/material";
import AdminMemorialForm from "./view/pages/Home/Home";
import Dashboard from "./view/components/Dashboard/Dashboard";
import PrivateRoute from "./view/routes/PrivateRoute";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout";
import AdminProfile from "./view/pages/Profile/Profile";

function AppLayout({ children }) {
  const location = useLocation();
  const hideSidebarAndHeader = ["/login", "/signup"].includes(location.pathname);

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
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardLayout />} />
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/home" element={<AdminMemorialForm />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/news" element={<Newspage />} />
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default App;
