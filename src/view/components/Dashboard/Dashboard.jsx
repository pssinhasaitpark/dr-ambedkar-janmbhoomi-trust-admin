import React from "react";
import { Box, Typography, Paper, Grid, Divider } from "@mui/material";



const Dashboard = () => {
  const memorialInfo = {
    title: "Dr Bhimrao Ambedkar Memorial Mhow",
    subtitle: "Bhim Janmabhoomi, Dr. Bhimrao Ambedkar Memorial Mhow",
    badge: "Dr Bhimrao Ambedkar",
    yearStart: 1994,
    yearComplete: 2007,
    openingDate: "14 April 2008",
    location: "Dr. Ambedkar Nagar (Mhow), Indore district, Madhya Pradesh, India",
  };
  return (
    <Box sx={{ justifyContent: 'center',display:"flex", position:"Fixed", width: "100%", mb: 4 }}>
    <Grid container spacing={2}>
      {/* Left Section - Memorial Info */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, color: "black", height: "100%" }}>
          <Typography variant="subtitle2" sx={{ p: 1, borderRadius: 1 }}>
            {memorialInfo.badge}
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
            {memorialInfo.subtitle.split(",")[0]},
            <Typography component="span" color="primary">
              {memorialInfo.subtitle.split(",")[1]}
            </Typography>
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Beginning Date: <Typography component="span">{memorialInfo.yearStart}</Typography>
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Completion Date: <Typography component="span">{memorialInfo.yearComplete}</Typography>
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Opening Date: <Typography component="span">{memorialInfo.openingDate}</Typography>
          </Typography>

          <Divider sx={{ my: 2, bgcolor: "white" }} />

          <Typography variant="h6">
            Location: <Typography component="span">{memorialInfo.location}</Typography>
          </Typography>
        </Paper>
      </Grid>

      
  
    </Grid>
  </Box>
  );
};

export default Dashboard;
