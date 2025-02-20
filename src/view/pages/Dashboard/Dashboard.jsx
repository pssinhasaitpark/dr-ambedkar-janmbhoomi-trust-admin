import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import { History, Work, School, Star } from "@mui/icons-material";

const Dashboard = () => {
  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#333" }}
      >
        Admin Dashboard - Dr. B.R. Ambedkar
      </Typography>

      {/* Overview Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        {[
          {
            title: "Constitution Architect",
            value: "Drafted the Indian Constitution",
            icon: <Work sx={{ fontSize: 40, color: "#ff9800" }} />, 
          },
          {
            title: "Social Reformer",
            value: "Fought for Dalit Rights & Equality",
            icon: <History sx={{ fontSize: 40, color: "#4caf50" }} />,
          },
          {
            title: "Education",
            value: "Multiple Doctorates",
            icon: <School sx={{ fontSize: 40, color: "#2196f3" }} />,
          },
          {
            title: "Awards & Recognition",
            value: "Bharat Ratna (1990)",
            icon: <Star sx={{ fontSize: 40, color: "#e91e63" }} />,
          },
        ].map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: "1 1 calc(25% - 24px)",
              minWidth: "220px",
              boxShadow: 5,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "white",
            }}
          >
            <CardContent>
              {item.icon}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Biography Section */}
      <Paper sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Biography
        </Typography>
        <Typography color="textSecondary">
          Dr. Bhimrao Ramji Ambedkar (1891-1956) was a social reformer, jurist, economist, and the chief architect of the Indian Constitution. He dedicated his life to fighting against caste discrimination and advocating for the rights of the marginalized. As India's first Law Minister, he played a key role in drafting the Constitution, ensuring equality, justice, and liberty for all.
        </Typography>
      </Paper>

      {/* Key Achievements */}
      <Paper sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Key Achievements
        </Typography>
        <List>
          {[
            "Drafting the Indian Constitution",
            "Establishing the Reserve Bank of India (RBI) framework",
            "Fighting for Dalit rights and reservation policies",
            "Promoting education and social reform",
            "Conversion to Buddhism and founding the Dalit Buddhist Movement",
          ].map((achievement, index) => (
            <ListItem key={index}>
              <ListItemText primary={achievement} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Political Career Timeline */}
      <Paper sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Political Career Timeline
        </Typography>
        <List>
          {[
            { year: "1947", event: "Became India's First Law Minister" },
            { year: "1949", event: "Drafted the Indian Constitution" },
            { year: "1956", event: "Embraced Buddhism with followers" },
            { year: "1990", event: "Awarded Bharat Ratna Posthumously" },
          ].map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={item.event} secondary={item.year} />
              </ListItem>
              {index < 3 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Policies Section */}
      <Paper sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Major Policies
        </Typography>
        <List>
          {[
            "Reservation Policies for SC/ST",
            "Hindu Code Bill Reforms",
            "Labor and Economic Reforms",
            "Formation of Finance Commission",
            "Promotion of Women’s Rights and Education",
          ].map((policy, index) => (
            <ListItem key={index}>
              <ListItemText primary={policy} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard;
