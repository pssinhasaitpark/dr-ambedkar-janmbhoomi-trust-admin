import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../../../assets/Images/logo.png"

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
    handleMenuClose();
  };

  return (
    <AppBar
    position="fixed"
    elevation={0}
    sx={{
      backgroundColor: "#fff",
      color: "#000",
      borderBottom: "1px solid #e0e0e0",
      width: `calc(100% - 240px)`, // Subtract sidebar width
      marginLeft: "240px", // Move right by sidebar width
    }}
  >
  
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          px: { xs: 1, sm: 2 },
          pt:"4px",
        }}
      >
        {/* Title */}
        <Box
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "14px", sm: "18px" },
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          Dr Ambedkar Janmbhoomi Trust
        </Box>
        {/* <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  }}
>
  <img
    src={logo}  // Update this path
    alt="Dr Ambedkar Janmbhoomi Trust Logo"
    style={{ maxWidth: "55px", height: "auto" }} // Adjust size as needed
  />
</Box> */}

        {/* Right Side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            justifyContent: "flex-end",
          }}
        >
          {!isMobile && <></>}

          {/* Avatar Menu */}
          <Avatar
            alt="User"
            src="https://via.placeholder.com/150"
            sx={{
              width: 32,
              height: 32,
              cursor: "pointer",
            }}
            onClick={handleMenuClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: "45px" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
