import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
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
  RateReview,
  LinkSharp,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
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
      subItems: [{ text: "Event List",  icon: <EmojiEvents />,path: "/eventlist" }],
    },
    {
      text: "Books and Publications",
      icon: <AutoStories />,
      path: "/Books-and-Publications",
      subItems: [{ text: "Books List", path: "/booklist" }],
    },
    {
      text: "Donation Collections",
      icon: <VolunteerActivism />,
      path: "/donationcollection",
      // subItems: [{ text: "Donation Collections", path: "/donationcollection" }],
    },
    {
      text: "News List",
      icon: <BarChart />,
      path: "/newslist",
    },
    { text: "Gallery", icon: <Collections />, path: "/gallery" },
    { text: "Trustees", icon: <Group />, path: "/trustee" },
    {
      text: "Contact & Enquiries",
      icon: <ContactMail />,
      path: "/Contact-&-Enquiries",
    },
    { text: "Subscribers", icon: <EmailSharp />, path: "/subscriber" },
    { text: "Testimonials", icon: <RateReview />, path: "/testimonials" },
    { text: "SocialMedia", icon: <LinkSharp />, path: "/socialmedia" },
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
            left:"10px",
            zIndex: 1300,
         
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
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ textAlign: "center", pt: 0, pb: 0 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img
              src={sidelogo}
              alt="Logo"
              style={{ marginRight: "10px", height: "60px" }}
            />
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Link
                to={item.path || "#"}
                onClick={() => handleParentClick(index, item)}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  backgroundColor:
                    activeParent === index ? "#a1c4ed" : "transparent",
                  color: activeParent === index ? "#020202" : "inherit",
                  fontWeight: activeParent === index ? "bold" : "normal",
                  fontSize: "15px",
                }}
              >
                <ListItemIcon
                  sx={{ color: activeParent === index ? "#1665c0" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems &&
                  (expandedIndex === index ? <ExpandLess /> : <ExpandMore />)}
              </Link>
              {item.subItems && (
                <Collapse
                  in={expandedIndex === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        to={subItem.path || "#"}
                        key={`${index}-${subIndex}`}
                        onClick={() =>
                          handleChildClick(index, subIndex, subItem)
                        }
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          padding: "10px 16px",
                          paddingLeft: "16px",
                          backgroundColor:
                            activeChild === `${index}-${subIndex}`
                              ? "#a1c4ed"
                              : "transparent",
                          color:
                            activeChild === `${index}-${subIndex}`
                              ? "#020202"
                              : "inherit",
                          fontWeight:
                            activeChild === `${index}-${subIndex}`
                              ? "bold"
                              : "normal",
                          fontSize: "14px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color:
                              activeParent === index ? "#020202" : "inherit",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </Link>
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
