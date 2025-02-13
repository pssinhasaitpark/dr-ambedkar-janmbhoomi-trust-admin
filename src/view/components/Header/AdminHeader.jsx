import React, { useState } from "react";
import { AppBar, Toolbar, InputBase, IconButton, Avatar, Badge, Box, Menu, MenuItem } from "@mui/material";
import { Search, Notifications, AttachMoney, Mail, AccessTime } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null); 
  const navigate = useNavigate(); 

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
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexBasis: { xs: "100%", md: "auto" },
            justifyContent: { xs: "flex-start", md: "flex-start" },
            mb: { xs: 1, md: 0 },
          }}
        >
          {}
          {onMenuClick && (
            <IconButton
              sx={{
                display: { xs: "inline-flex", md: "none" },
              }}
              onClick={onMenuClick}
            >
              <Search sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          {}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f7f7f7",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              width: { xs: "70%", sm: 300 },
              marginLeft: { xs: "auto", sm: 0 }, 
            }}
          >
            <InputBase
              placeholder="Search term"
              sx={{
                flex: 1,
                color: "#9e9e9e",
                fontSize: 14,
              }}
            />
            <Search sx={{ color: "#9e9e9e", fontSize: 20 }} />
          </Box>
        </Box>

        {}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            justifyContent: { xs: "flex-end" },
            width: { xs: "100%", sm: "auto" }, 
          }}
        >
          {}
          <IconButton>
            <Badge badgeContent={4} color="success">
              <Notifications sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
          <IconButton>
            <AttachMoney sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton>
            <Mail sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton>
            <AccessTime sx={{ fontSize: 20 }} />
          </IconButton>

          {}
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
