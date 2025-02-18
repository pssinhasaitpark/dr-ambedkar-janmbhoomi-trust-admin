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
  RateReview,
 Info,
 AutoStories,
 Collections,
VolunteerActivism,
  BarChart,
  Settings,
  Label,
  ExpandLess,
  ExpandMore,
  ContactMail,
  Menu as MenuIcon,
  Close as CloseIcon, 
} from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
// import sidelogo from "../../../assests/logo.svg fill.svg";

const Sidebar = () => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dash" },
 
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "About", icon: <Info />, path: "/about" },
    { text: "Museum & Exhibits", icon: <RateReview />, path: "/Exhibition" },
    { text: "Events & Celebrations", icon: <EmojiEvents />, path: "/event" },
    { text: "Donation and Support", icon: <VolunteerActivism />, path: "/donation" },
    { text: "Books and Publications", icon: <AutoStories  />, path: "/book" },
    { text: "News & Updates", icon: <BarChart />, path: "/News" },
    { text: "Gallery", icon: <Collections />, path: "/Gallery" },
    { text: "Contact & Inquiries", icon: <ContactMail />, path: "/Contact" },
  ];

  // const settingsItems = [
  //   { text: "Setting Sample 1", path: "/settings/setingsample1" },
  //   { text: "Setting Sample 2", path: "/settings/setingsample1" },
  // ];

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

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
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
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {/* <img
              src={sidelogo}
              alt="Nest Logo"
              style={{ marginRight: "10px" }}
            /> */}
          </Typography>
          <Typography variant="body2" color="textSecondary">
          Dr Ambedkar Janmbhoomi trust
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
                  backgroundColor:
                    activeParent === index ? "#eafaf1" : "transparent",
                  "&:hover": { backgroundColor: "#eafaf1" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activeParent === index ? "#3bb77e" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      color: activeParent === index ? "#3bb77e" : "inherit",
                      fontWeight: activeParent === index ? "bold" : "normal",
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
        <Divider />
        <List>
          <ListItem
            button
            onClick={handleSettingsClick}
            sx={{
              backgroundColor: settingsOpen ? "#eafaf1" : "transparent",
              "&:hover": { backgroundColor: "#eafaf1" },
            }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              sx={{
                "& .MuiTypography-root": {
                  color: settingsOpen ? "#3bb77e" : "inherit",
                  fontWeight: settingsOpen ? "bold" : "normal",
                },
              }}
            />
            {settingsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          {/* <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {settingsItems.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() =>
                    handleParentClick(menuItems.length + index, item)
                  }
                  sx={{
                    pl: 2,
                    backgroundColor:
                      activeParent === menuItems.length + index
                        ? "#eafaf1"
                        : "transparent",
                    "&:hover": { backgroundColor: "#eafaf1" },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiTypography-root": {
                        color:
                          activeParent === menuItems.length + index
                            ? "#3bb77e"
                            : "inherit",
                        fontWeight:
                          activeParent === menuItems.length + index
                            ? "bold"
                            : "normal",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse> */}
{/* 
          <ListItem
            button
            onClick={() =>
              handleParentClick(
                menuItems.length + settingsItems.length,
                settingsItems[1]
              )
            }
            sx={{
              backgroundColor:
                activeParent === menuItems.length + settingsItems.length
                  ? "#eafaf1"
                  : "transparent",
              "&:hover": { backgroundColor: "#eafaf1" },
            }}
          >
            <ListItemIcon>
              <Label />
            </ListItemIcon>
            <ListItemText
              primary="Starter Page"
              sx={{
                "& .MuiTypography-root": {
                  color:
                    activeParent === menuItems.length + settingsItems.length
                      ? "#3bb77e"
                      : "inherit",
                  fontWeight:
                    activeParent === menuItems.length + settingsItems.length
                      ? "bold"
                      : "normal",
                },
              }}
            />
          </ListItem> */}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
