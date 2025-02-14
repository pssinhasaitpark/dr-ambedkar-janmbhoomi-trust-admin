import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import AboutPage from "../src/view/pages/About/About";
import Login from "./view/pages/Login/AdminLogin";
import Sidebar from "./view/components/SideBar/Sidebar";
import Header from "./view/components/Header/AdminHeader";

import { Box } from "@mui/material";
import AdminMemorialForm from "./view/pages/Home/Home";

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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<AdminMemorialForm />} />
        
      </Routes>
    </AppLayout>
  );
}

export default App;
