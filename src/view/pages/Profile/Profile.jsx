import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfileData } from "../../redux/slice/profileSlice";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import { Email, Person, Phone } from "@mui/icons-material";

const Profile = () => {
  const dispatch = useDispatch();
  const {first_name, last_name, user_name,user_role, email, mobile, loading, error } =
    useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  // Generate initials for avatar
  const getInitials = (first, last) => {
    if (first && last) return `${first[0]}`.toUpperCase();
    return "A P";
  };

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
        <Typography color="error">Error: {error}</Typography>
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
        {/* Avatar with Initials */}
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            mb: 2,
            fontSize: 32,
            fontWeight: "bold",
            bgcolor: "#4c2093",
            color: "#fff",
          }}
        >
          {getInitials(first_name, last_name)}
        </Avatar>

        <CardContent>
          {/* Profile Details */}
          <Grid container spacing={2}>
            {/* Full Name */}

            {/* Username */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  padding: 2,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: 1,
                }}
              >
                <Person fontSize="small" color="primary" />
                <Typography variant="body1">{user_name || "User"}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                sx={{
                  padding: 2,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: 1,
                }}
              >
                <Person fontSize="small" color="primary" />
                <Typography variant="body1">
                  {user_role || "admin"}
                </Typography>
              </Paper>
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  padding: 2,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: 1,
                }}
              >
                <Email fontSize="small" color="primary" />
                <Typography variant="body1">
                  {email || "admin@parkhya.net"}
                </Typography>
              </Paper>
            </Grid>

            {/* Mobile */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  padding: 2,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: 1,
                }}
              >
                <Phone fontSize="small" color="primary" />
                <Typography variant="body1">
                  {mobile || "1234567898"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
