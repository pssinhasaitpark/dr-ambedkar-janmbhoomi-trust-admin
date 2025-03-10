import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowDown } from "@mui/icons-material";

const Header = () => {
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

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
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
        marginTop: "1px",
        minHeight: "69px",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          px: { xs: 1, sm: 2 },
        }}
      >
        <div style={{ flexGrow: 1, textAlign: "center", paddingLeft: "35px" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "18px", paddingLeft: "16%" },
              color: "#3B0089",
            }}
          >
            Dr Ambedkar Janmbhoomi Trust
          </Typography>
        </div>

        {/* Right Side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // gap: { xs: 1, sm: 2 },
            justifyContent: "flex-end",
          }}
        >
          {!isMobile && <></>}

          {/* Avatar Menu */}
          <Avatar
            alt="Admin"
            src="https://via.placeholder.com/150"
            sx={{
              width: 40,
              height: 40,
              cursor: "pointer",
            }}
            onClick={handleMenuClick}
          />
          <KeyboardArrowDown
            fontSize="small"
            sx={{ cursor: "pointer" }}
            onClick={handleMenuClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: "45px" }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
