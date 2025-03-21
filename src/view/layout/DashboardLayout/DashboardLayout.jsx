// DashboardLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SideBar/Sidebar";
import Header from "../../components/Header/AdminHeader";
import { Box } from "@mui/material";

const DashboardLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;