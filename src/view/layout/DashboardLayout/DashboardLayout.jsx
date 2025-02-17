import React from "react";
import { Routes, Route } from "react-router-dom";

import AboutPage from "../../pages/About/About";

import AdminMemorialForm from "../../pages/Home/Home";
import Dashboard from "../../components/Dashboard/Dashboard";

const DashboardLayout = () => {
  return (
    <>
      <Routes>
      <Route path="dash" element={<Dashboard />} />
        <Route path="home" element={<AdminMemorialForm />} />
        <Route path="about" element={<AboutPage />} />
      </Routes>
    </>
  );
};

export default DashboardLayout;
