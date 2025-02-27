import React, { useState, useEffect } from "react";
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
  EmailSharp,
  Group,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import sidelogo from "../../../assets/Images/logo.png";

const Sidebar = () => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "About", icon: <Info />, path: "/about" },
    {
      text: "Events & Celebrations",
      icon: <EmojiEvents />,
      path: "/Events-&-Celebrations",
      subItems: [{ text: "Event List", path: "/eventlist" }],
    },
    {
      text: "Donation and Support",
      icon: <VolunteerActivism />,
      path: "/Donation-and-Support",
      subItems: [{ text: "Donation Collections", path: "/donationcollection" }],
    },
    {
      text: "Books and Publications",
      icon: <AutoStories />,
      path: "/Books-and-Publications",
      subItems: [{ text: "Books List", icon: <AutoStories />, path: "/booklist" }],
    },
    {
      text: "News & Updates",
      icon: <BarChart />,
      path: "/News-&-Updates",
      subItems: [{ text: "News List", icon: <AutoStories />, path: "/newslist" }],
    },
    { text: "Gallery", icon: <Collections />, path: "/gallery" },
    { text: "Trustees", icon: <Group />, path: "/trustee" },
    { text: "Contact & Enquiries", icon: <ContactMail />, path: "/Contact-&-Enquiries" },
    { text: "Subscribers", icon: <EmailSharp />, path: "/subscriber" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    let parentIndex = null;
    let childIndex = null;
    
    menuItems.forEach((item, index) => {
      if (currentPath === item.path) {
        parentIndex = index;
      } else if (item.subItems) {
        item.subItems.forEach((subItem, subIdx) => {
          if (currentPath.startsWith(subItem.path)) {
            parentIndex = index;
            childIndex = `${index}-${subIdx}`;
          }
        });
      }
    });

    if (currentPath === "/") {
      setActiveParent(0); // Highlight Dashboard
    } else {
      setActiveParent(parentIndex);
      setActiveChild(childIndex);
      setExpandedIndex(parentIndex); // Expand the active submenu
    }
  }, [location.pathname]);

  const handleParentClick = (index, item) => {
    if (item.subItems) {
      setExpandedIndex(expandedIndex === index ? null : index);
      navigate(item.path);
    } else {
      setActiveParent(index);
      setExpandedIndex(null);
      navigate(item.path);
    }
  };

  const handleChildClick = (parentIndex, childIndex, childItem) => {
    setActiveParent(parentIndex);
    setActiveChild(`${parentIndex}-${childIndex}`);
    navigate(childItem.path);
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
        <Box sx={{ textAlign: "center", pt: 0, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src={sidelogo} alt="Logo" style={{ marginRight: "10px", height: "60px" }} />
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleParentClick(index, item)}
                sx={{
                  backgroundColor: activeParent === index ? "#a1c4ed" : "transparent",
                  "&:hover": { backgroundColor: "#a1c4ed" },
                }}
              >
                <ListItemIcon sx={{ color: activeParent === index ? "#1665c0" : "inherit" }}>
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
                {item.subItems && (expandedIndex === index ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {item.subItems && (
                <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem
                        button
                        key={`${index}-${subIndex}`}
                        onClick={() => handleChildClick(index, subIndex, subItem)}
                        sx={{
                          pl: 6,
                          backgroundColor: activeChild === `${index}-${subIndex}` ? "#a1c4ed" : "transparent",
                          "&:hover": { backgroundColor: "#a1c4ed" },
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            "& .MuiTypography-root": {
                              color: activeChild === `${index}-${subIndex}` ? "#020202" : "inherit",
                              fontWeight: activeChild === `${index}-${subIndex}` ? "bold" : "normal",
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
