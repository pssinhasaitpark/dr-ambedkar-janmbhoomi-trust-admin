import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData, submitHomeData } from "../../redux/slice/homeSlice";
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
import { toast } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();
  const { homeData, isLoading } = useSelector((state) => state.home);
  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    beginningDate: "",
    completionDate: "",
    openingDate: "",
    location: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [bannerId, setBannerId] = useState(null);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  useEffect(() => {
    if (homeData?.data?.length > 0) {
      const banner = homeData.data[0]; // Fetch the first banner
      setBannerId(banner._id);
      setFormData({
        title: banner.name || "",
        heading: banner.heading || "",
        beginningDate: banner.beginning_date || "",
        completionDate: banner.completion_date || "",
        openingDate: banner.opening_date || "",
        location: banner.location || "",
      });
      setSelectedImages(banner.image_urls || []);
    }
  }, [homeData]);

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

    if (
      !formData.title ||
      !formData.heading ||
      !formData.beginningDate ||
      !formData.completionDate ||
      !formData.openingDate ||
      !formData.location
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.title);
    formDataToSend.append("heading", formData.heading);
    formDataToSend.append("beginning_date", formData.beginningDate);
    formDataToSend.append("completion_date", formData.completionDate);
    formDataToSend.append("opening_date", formData.openingDate);
    formDataToSend.append("location", formData.location);

    selectedImages.forEach((img) => {
      if (img.file) {
        formDataToSend.append("images", img.file);
      }
    });

    dispatch(submitHomeData({ id: bannerId, formData: formDataToSend }))
      .unwrap()
      .then(() => {
        toast.success("Home data submitted successfully!");
      })
      .catch((error) => {
        toast.error(error || "Submission failed");
      });
  };

  return (
    <Box sx={{ display: "flex", boxShadow: 3, borderRadius: 2, backgroundColor: "#fff" }}>
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Home Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Heading" name="heading" value={formData.heading} onChange={handleInputChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Beginning Date" name="beginningDate" value={formData.beginningDate} onChange={handleInputChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Completion Date" name="completionDate" value={formData.completionDate} onChange={handleInputChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Opening Date" name="openingDate" value={formData.openingDate} onChange={handleInputChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleInputChange} required sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
            Save
          </Button>
        </form>
      </Box>
      <Box sx={{ flex: 1, p: 3, textAlign: "center", borderLeft: "1px solid #ddd" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Uploaded Images
        </Typography>
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Choose Images
          <input type="file" multiple hidden onChange={handleImageChange} />
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {selectedImages.map((image, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Card sx={{ position: "relative" }}>
                <CardMedia component="img" height="100" image={typeof image === "string" ? image : image.url} alt="Uploaded Image" />
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

export default Home;
