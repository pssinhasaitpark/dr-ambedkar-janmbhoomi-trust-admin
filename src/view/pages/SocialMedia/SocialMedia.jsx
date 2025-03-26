import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSocialMedia,
  updateSocialMedia,
  addSocialMedia,
} from "../../redux/slice/socialMediaSlice";
import { WhatsApp, Facebook, Instagram, YouTube } from "@mui/icons-material";

const SocialMedia = () => {
  const dispatch = useDispatch();
  const { links, id, loading} = useSelector(
    (state) => state.socialMedia
  );
  const [showLoader, setShowLoader] = useState(true);

  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    facebook: "",
    instagram: "",
    youtube: "",
  });

  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchSocialMedia());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (links) {
      setSocialLinks({
        whatsapp: links.whatsapp?.link || "",
        facebook: links.facebook?.link || "",
        instagram: links.instagram?.link || "",
        youtube: links.youtube?.link || "",
      });
    }
  }, [links]);

  if (loading || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );

  const handleChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const handleSaveAll = async () => {
    if (id) {
      // Update existing data
      setSaving(true);
      try {
        await dispatch(
          updateSocialMedia({ id, updatedLinks: socialLinks })
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Social media links updated successfully!",
          severity: "success",
        });
        dispatch(fetchSocialMedia());
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Update failed. Try again.",
          severity: "error",
        });
      } finally {
        setSaving(false);
      }
    } else {
      // Add new data
      setSaving(true);
      try {
        await dispatch(addSocialMedia(socialLinks)).unwrap();
        setSnackbar({
          open: true,
          message: "Social media links added successfully!",
          severity: "success",
        });
        dispatch(fetchSocialMedia());
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Adding failed. Try again.",
          severity: "error",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const iconMap = {
    whatsapp: <WhatsApp sx={{ color: "#25D366", fontSize: 32 }} />,
    facebook: <Facebook sx={{ color: "#1877F2", fontSize: 32 }} />,
    instagram: <Instagram sx={{ color: "#E1306C", fontSize: 32 }} />,
    youtube: <YouTube sx={{ color: "red", fontSize: 32 }} />,
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          mt: 10,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 5 }}>
          Social Media Links
        </Typography>

        {/* Input Fields with Icons Outside */}
        {Object?.keys(socialLinks)?.map((key) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            {/* Icon */}
            <Box sx={{ width: 40, display: "flex", justifyContent: "center" }}>
              {iconMap[key]}
            </Box>

            {/* Input Field */}
            <TextField
              fullWidth
              label={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
              name={key}
              value={socialLinks[key]}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                  py: 1.2, // Adjust padding for input height consistency
                },
              }}
            />
          </Box>
        ))}

        {/* Save All Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSaveAll}
            disabled={saving}
            sx={{
              minWidth: 140,
              py: 1,
              backgroundColor: "#1665c0",
              "&:hover": {
                backgroundColor: "#1665c0",
              },
            }}
          >
            {saving ? <CircularProgress size={24} /> : "Update All"}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SocialMedia;
