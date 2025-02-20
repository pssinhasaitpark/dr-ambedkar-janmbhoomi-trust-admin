import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfileData } from "../../redux/slice/profileSlice";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Email, Person, Phone } from "@mui/icons-material";
import logo from "../../../assets/Images/logo.png";

const Profile = () => {
  const dispatch = useDispatch();
  const { first_name, last_name, user_name, email, mobile, loading, error } =
    useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">
          Error: {typeof error === "string" ? error : JSON.stringify(error)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 3,
          textAlign: "center",
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
          src={logo}
          alt="User Avatar"
        />

        <CardContent>
          {/* User Information */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {first_name} {last_name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Person fontSize="small" />
            {user_name || "User"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Profile Details */}
          <Box container spacing={2}>
            <Box item xs={12}>
              <Paper
                sx={{
                  padding: 2,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Email fontSize="small" />
                <Typography variant="body1">
                  {email || "No email available"}
                </Typography>
              </Paper>
            </Box>

            <Box item xs={12}>
              <Paper
                sx={{
                  padding: 2,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Phone fontSize="small" />
                <Typography variant="body1">
                  {mobile || "No contact available"}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
