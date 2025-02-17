import React, { useState } from "react";
import { AppBar, Toolbar, Avatar, Box, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { useTheme } from "@mui/material/styles";
import { logoutUser } from "../../redux/slice/authslice"; // Import logoutUser action
import logo from "../../../assets/Images/logo.png";

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch for Redux
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logoutUser action to handle logout through Redux
    handleMenuClose();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "#fff", color: "#000", borderBottom: "1px solid #e0e0e0", width: `calc(100% - 240px)`, marginLeft: "240px" }}>
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", px: { xs: 1, sm: 2 }, pt: "4px" }}>
        <Box sx={{ fontWeight: "bold", fontSize: { xs: "14px", sm: "18px" }, textAlign: "center", flexGrow: 1 }}>
          Dr Ambedkar Janmbhoomi Trust
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, justifyContent: "flex-end" }}>
          <Avatar alt="User" src="https://via.placeholder.com/150" sx={{ width: 32, height: 32, cursor: "pointer" }} onClick={handleMenuClick} />
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: "45px" }}>
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
