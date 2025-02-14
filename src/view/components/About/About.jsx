import React, { useState } from "react";
import { 
  Box, Typography, TextField, Button, Paper, 
  Grid, Input, IconButton, Avatar 
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [dob, setDob] = useState("");
  const [achievements, setAchievements] = useState("");
  const [contributions, setContributions] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const aboutData = {
      aboutText,
      dob,
      achievements,
      contributions,
      image: selectedImage,
    };
    console.log("Saved Data:", aboutData);
    // Here you can send aboutData to an API to save in the database
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        About Dr. Ambedkar
      </Typography>

      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Grid container spacing={2}>
          {/* Profile Image Upload */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Avatar 
              src={selectedImage} 
              alt="Dr. Ambedkar" 
              sx={{ width: 120, height: 120, mb: 1, mx: "auto" }} 
            />
            <IconButton color="primary" component="label">
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
              <PhotoCamera />
            </IconButton>
          </Grid>

          {/* Form Fields */}
          <Grid item xs={12} md={8}>
            {/* Name */}
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value="Dr. Bhimrao Ambedkar"
              disabled
              sx={{ mb: 2 }}
            />

            {/* Date of Birth */}
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              variant="outlined"
              value={dob}
              onChange={(e) => handleChange(e, setDob)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            {/* Key Achievements */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Key Achievements"
              variant="outlined"
              placeholder="List Dr. Ambedkar's key achievements..."
              value={achievements}
              onChange={(e) => handleChange(e, setAchievements)}
              sx={{ mb: 2 }}
            />

            {/* Contributions */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Contributions"
              variant="outlined"
              placeholder="Describe his contributions..."
              value={contributions}
              onChange={(e) => handleChange(e, setContributions)}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* About Text */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="About Dr. Ambedkar"
              variant="outlined"
              placeholder="Write about Dr. Ambedkar's life..."
              value={aboutText}
              onChange={(e) => handleChange(e, setAboutText)}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default About;
