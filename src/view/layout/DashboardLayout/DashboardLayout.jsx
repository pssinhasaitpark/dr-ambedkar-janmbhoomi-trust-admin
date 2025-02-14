import React from "react";
import { Routes, Route } from "react-router-dom";

import AboutPage from "../../pages/About/About";

import AdminMemorialForm from "../../pages/Home/Home";

const DashboardLayout = () => {
  return (
    <>
      <Routes>
        <Route path="home" element={<AdminMemorialForm />} />
        <Route path="about" element={<AboutPage />} />
      </Routes>
    </>
  );
};

export default DashboardLayout;
