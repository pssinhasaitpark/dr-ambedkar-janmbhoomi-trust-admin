// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Avatar,
//   Box,
//   Menu,
//   MenuItem,
//   useMediaQuery,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux"; 
// import { useTheme } from "@mui/material/styles";
// import { logoutUser } from "../../redux/slice/authslice";
// import logo from "../../../assets/Images/logo.png";

// const Header = ({ onMenuClick }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const theme = useTheme();
  
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     handleMenuClose();
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* Fixed AppBar for Desktop, Static for Mobile */}
//       <AppBar
//         position={isDesktop ? "fixed" : "static"}
//         elevation={0}
//         sx={{
//           backgroundColor: "#fff",
//           color: "#000",
//           borderBottom: "1px solid #e0e0e0",
//           top: 0,
//           width: "100%",
//           zIndex: 1100,
//         }}
//       >
//         <Toolbar
//           sx={{
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             px: { xs: 1, sm: 2 },
//           }}
//         >
//           {/* Title */}
//           <Box
//             sx={{
//               fontWeight: "bold",
//               fontSize: { xs: "14px", sm: "18px" },
//               textAlign: "center",
//               flexGrow: 1,
//             }}
//           >
//             Dr Ambedkar Janmbhoomi Trust
//           </Box>

//           {/* Right Side */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: { xs: 1, sm: 2 },
//               justifyContent: "flex-end",
//             }}
//           >
//             {!isMobile && <></>}

//             {/* Avatar Menu */}
//             <Avatar
//               alt="User"
//               src="https://via.placeholder.com/150"
//               sx={{
//                 width: 32,
//                 height: 32,
//                 cursor: "pointer",
//               }}
//               onClick={handleMenuClick}
//             />
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               sx={{ mt: "45px" }}
//             >
//               <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//               <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Spacer for Fixed Header (Only for Desktop) */}
//       {isDesktop && <Toolbar />}
//     </>
//   );
// };

// export default Header;
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
          px: { xs: 1, sm: 2 },
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
          Dr Ambedkar Janmbhoomi trust
        </Box>

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
            {/* <MenuItem onClick={handleMenuClose}>My Account</MenuItem> */}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
