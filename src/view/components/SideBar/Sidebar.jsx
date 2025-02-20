import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  EmojiEvents,
 Info,
 AutoStories,
 Collections,
VolunteerActivism,
  BarChart,
  ExpandLess,
  ExpandMore,
  ContactMail,
  Menu as MenuIcon,
  Close as CloseIcon, 
} from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import sidelogo from "../../../assets/Images/logo.png";

const Sidebar = () => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);


  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dash" },
 
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "About", icon: <Info />, path: "/about" },
    { text: "Events & Celebrations", icon: <EmojiEvents />, path: "/event" },
    { text: "Donation and Support", icon: <VolunteerActivism />, path: "/donation" },
    { text: "Books and Publications", icon: <AutoStories  />, path: "/book" },
    { text: "News & Updates", icon: <BarChart />, path: "/news" },
    { text: "Gallery", icon: <Collections />, path: "/gallery" },
    { text: "Contact & Inquiries", icon: <ContactMail />, path: "/Contact" },
  ];


  const handleParentClick = (index, item) => {
    setActiveParent(index);
    setActiveChild(null);
    setExpandedIndex(expandedIndex === index ? null : index);

    if (item.path) {
      navigate(item.path);
    }
  };

  const handleChildClick = (parentIndex, childIndex, childItem) => {
    setActiveParent(parentIndex);
    setActiveChild(`${parentIndex}-${childIndex}`);
    if (childItem.path) {
      navigate(childItem.path);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };



  return (
    <>
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "absolute",
            top: "10px",
            // left: "10px",
            zIndex: 1300,
            right: drawerOpen ? "10px" : "inherit",
            left: drawerOpen ? "inherit" : "10px",
          }}
        >
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}

        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? drawerOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ textAlign: "center",  pt: 0, pb: 0}}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <img
              src={sidelogo}
              alt="Nest Logo"
              style={{ marginRight: "10px",height: "60px"  }}
            />
          </Typography>
          {/* <Typography variant="body2" color="textSecondary">
          Dr Ambedkar Janmbhoomi trust
          </Typography> */}
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleParentClick(index, item)}
                sx={{
                  backgroundColor:
                    activeParent === index ? "#a1c4ed" : "transparent",
                  "&:hover": { backgroundColor: "#a1c4ed" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activeParent === index ? "#1665c0" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      color: activeParent === index ? "#020202" : "inherit",
                      fontWeight: activeParent === index ? "bold" : "normal",
                      fontSize: "15px",
                    },
                  }}
                />
                {item.subItems &&
                  (expandedIndex === index ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {item.subItems && (
                <Collapse
                  in={expandedIndex === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem
                        button
                        key={`${index}-${subIndex}`}
                        onClick={() =>
                          handleChildClick(index, subIndex, subItem)
                        }
                        sx={{
                          pl: 6,
                          backgroundColor:
                            activeChild === `${index}-${subIndex}`
                              ? "#eafaf1"
                              : "transparent",
                          "&:hover": { backgroundColor: "#eafaf1" },
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            "& .MuiTypography-root": {
                              color:
                                activeChild === `${index}-${subIndex}`
                                  ? "#3bb77e"
                                  : "inherit",
                              fontWeight:
                                activeChild === `${index}-${subIndex}`
                                  ? "bold"
                                  : "normal",
                                  fontSize: "14px",
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
        
      
      </Drawer>
    </>
  );
};

export default Sidebar;
