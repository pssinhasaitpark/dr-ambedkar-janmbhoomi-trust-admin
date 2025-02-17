import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { submitMemorialData, updateMemorialData } from "../../redux/slice/memorialSlice";
import { toast } from "react-toastify";

const AdminMemorialForm = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.memorial);

  // Load saved form data from localStorage (if available)
  const getSavedFormData = () => {
    const savedData = localStorage.getItem("memorialFormData");
    return savedData ? JSON.parse(savedData) : {
      title: "",
      beginningDate: "",
      completionDate: "",
      openingDate: "",
      location: "",
    };
  };

  const getSavedImages = () => {
    const savedImages = localStorage.getItem("memorialImages");
    return savedImages ? JSON.parse(savedImages) : [];
  };

  const [formData, setFormData] = useState(getSavedFormData());
  const [selectedImages, setSelectedImages] = useState(getSavedImages());
  const [isUpdate, setIsUpdate] = useState(false);  
  const [memorialId, setMemorialId] = useState(null); 


  useEffect(() => {
    localStorage.setItem("memorialFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("memorialImages", JSON.stringify(selectedImages));
  }, [selectedImages]);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setSelectedImages([...selectedImages, ...newImages]);
  };

 
  const handleImageRemove = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.beginningDate || !formData.completionDate || !formData.openingDate || !formData.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.title);
    formDataToSend.append("heading", formData.title);
    formDataToSend.append("beginning_date", formData.beginningDate);
    formDataToSend.append("completion_date", formData.completionDate);
    formDataToSend.append("opening_date", formData.openingDate);
    formDataToSend.append("location", formData.location);

    selectedImages.forEach((img) => {
      formDataToSend.append("images", img.file);
    });

    if (isUpdate) {
      dispatch(updateMemorialData({ id: memorialId, formData: formDataToSend }))
        .unwrap()
        .then(() => {
          toast.success("Memorial data updated successfully!");
          // resetForm();
        })
        .catch((error) => {
          toast.error(error || "Update failed");
        });
    } else {
      dispatch(submitMemorialData(formDataToSend))
        .unwrap()
        .then(() => {
          toast.success("Memorial data submitted successfully!");
          // resetForm();
        })
        .catch((error) => {
          toast.error(error || "Submission failed");
        });
    }
  };

  // Reset Form
  // const resetForm = () => {
  //   setFormData({
  //     title: "",
  //     beginningDate: "",
  //     completionDate: "",
  //     openingDate: "",
  //     location: "",
  //   });
  //   setSelectedImages([]);
  //   setIsUpdate(false);
  //   setMemorialId(null);
  //   localStorage.removeItem("memorialFormData");
  //   localStorage.removeItem("memorialImages");
  // };

  return (
    <Box sx={{ display: "flex", maxWidth: 1000, mx: "auto", mt: 10, boxShadow: 3, borderRadius: 2, backgroundColor: "#fff" }}>
      {/* Left Section - Form */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Memorial Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Beginning Date"
            name="beginningDate"
            value={formData.beginningDate}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Completion Date"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Opening Date"
            name="openingDate"
            value={formData.openingDate}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          {/* Display Save or Update button */}
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
            {isUpdate ? "Update" : "Save"}
          </Button>
        </form>
      </Box>

      {/* Right Section - Image Upload */}
      <Box sx={{ flex: 1, p: 3, textAlign: "center", borderLeft: "1px solid #ddd" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Upload Images</Typography>
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Choose Images
          <input type="file" multiple hidden onChange={handleImageChange} />
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {selectedImages.map((image, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Card sx={{ position: "relative" }}>
                <CardMedia component="img" height="100" image={image.url} alt="Uploaded Image" />
                <IconButton onClick={() => handleImageRemove(index)} sx={{ position: "absolute", top: 2, right: 2 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminMemorialForm;
