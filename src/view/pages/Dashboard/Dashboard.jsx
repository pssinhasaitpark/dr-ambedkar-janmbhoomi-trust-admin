import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubscribersCount,
  fetchInquiriesCount,
  fetchMessagesCount,
  fetchEventsCount,
} from "../../redux/slice/dashboardSlice";
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CurrencyRupee, Email, Event, People } from "@mui/icons-material";
import banner from "../../../assets/Images/banner.png";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSubscribers,
    totalInquiries,
    totalMessages,
    totalEvents,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchSubscribersCount());
    dispatch(fetchInquiriesCount());
    dispatch(fetchMessagesCount());
    dispatch(fetchEventsCount());
  }, [dispatch]);

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 4 ,mt:7}}>
      {/* Banner Image */}
      <Box
        sx={{
          width: "100%",
          height: 400,
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", p: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#333" }}>
          Admin Dashboard - Dr Ambedkar Janmbhoomi trust
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mx: 4, mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      {/* Dynamic Stats Section */}
      <Box sx={{ px: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {[
            {
              title: "Total Events & Celebration",
              value: totalSubscribers,
              icon: <Event sx={{ fontSize: 40, color: "#ff9800" }} />,
            },
            {
              title: "Total Donation",
              value: totalInquiries,
              icon: <CurrencyRupee sx={{ fontSize: 40, color: "#4caf50" }} />,
            },
            {
              title: "Total Equireis",
              value: totalMessages,
              icon: <Email sx={{ fontSize: 40, color: "#2196f3" }} />,
            },
            {
              title: "Total Trustees",
              value: totalEvents,
              icon: <People  sx={{ fontSize: 40, color: "#e91e63" }} />,
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
                {item.icon}
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {loading ? <CircularProgress size={24} /> : item.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Biography Section */}
      <Paper
  sx={{ p: 4, mx: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}
>
  <Typography variant="h5" fontWeight="bold" gutterBottom>
    Biography
  </Typography>
  <Typography color="textSecondary">
    Dr. Bhimrao Ramji Ambedkar (14 April 1891 – 6 December 1956) was an Indian
    jurist, economist, social reformer, and the chief architect of the Indian
    Constitution. He was a champion of social justice and dedicated his life
    to the upliftment of marginalized communities. Ambedkar was the first Law
    Minister of independent India and played a crucial role in drafting the
    Constitution. He was posthumously awarded the Bharat Ratna, India's
    highest civilian award, in 1990.
  </Typography>

  {/* Key Achievements Section */}
  <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
    Key Achievements
  </Typography>
  <List>
    {[
      "Architect of the Indian Constitution",
      "First Law Minister of India",
      "Champion of Dalit Rights and Social Justice",
      "Fought for Women's Rights and Labor Welfare",
      "Founded the Scheduled Castes Federation and later the Republican Party of India",
      "Led the Dalit Buddhist Movement and embraced Buddhism in 1956",
    ].map((achievement, index) => (
      <ListItem key={index}>
        <ListItemText primary={achievement} />
      </ListItem>
    ))}
  </List>
</Paper>

    </Box>
  );
};

export default Dashboard;
