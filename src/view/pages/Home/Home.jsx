import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminMemorialForm = () => {
  // Fixed data except location
  const [formData, setFormData] = useState({
    title: "Bhim Janmabhoomi, Dr. Bhimrao Ambedkar Memorial Mhow",
    beginningDate: "1994",
    completionDate: "2007",
    openingDate: "14 April 2008",
    location: "", // Admin can update this field
    images: [],
  });

  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 600,
        mx: "auto",
        mt: "15%", // Added margin from the top
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Memorial Information
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Beginning Date"
          name="beginningDate"
          value={formData.beginningDate}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Completion Date"
          name="completionDate"
          value={formData.completionDate}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Opening Date"
          name="openingDate"
          value={formData.openingDate}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleLocationChange}
          sx={{ mb: 2 }}
        />

        {/* Multiple Image Upload */}
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Upload Images
          <input type="file" multiple hidden onChange={handleImageChange} />
        </Button>

        {/* Image Preview with Remove Option */}
        <Grid container spacing={2}>
          {formData.images.map((image, index) => (
            <Grid item xs={4} key={index}>
              <Card sx={{ position: "relative" }}>
                <CardMedia component="img" height="100" image={image.url} alt="Uploaded Image" />
                <IconButton
                  sx={{ position: "absolute", top: 2, right: 2, backgroundColor: "rgba(255,255,255,0.8)" }}
                  onClick={() => handleImageRemove(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AdminMemorialForm;
