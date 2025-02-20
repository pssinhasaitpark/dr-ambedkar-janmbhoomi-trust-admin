// components/Gallery.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGalleryData,
  saveGalleryToBackend,
} from "../../redux/slice/gallerySlice";

const Gallery = () => {
  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.gallery);
  const [formData, setFormData] = useState({ ...galleryData });
  const [isEditable, setIsEditable] = useState(false);
  const errorMessage = galleryData.error;

  useEffect(() => {
    dispatch(fetchGalleryData());
  }, [dispatch]);

  useEffect(() => {
    setFormData({ ...galleryData });
  }, [galleryData]);

  useEffect(() => {
    if (errorMessage) {
      alert(`Error: ${typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage)}`);
    }
  }, [errorMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event, field) => {
    const files = Array.from(event.target.files);
    setFormData({ ...formData, [field]: [...(formData[field] || []), ...files] });
  };

  const handleImageRemove = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isEditable) {
      const dataToSend = new FormData();

      // Append text fields
      if (formData.gallery_info) dataToSend.append("gallery_info", formData.gallery_info);
      if (formData.gallery_description) dataToSend.append("gallery_description", formData.gallery_description);

      // Append media files
      ["birthplace_media", "events_media", "exhibitions_media", "online_media"].forEach((field) => {
        if (formData[field] && formData[field].length > 0) {
          formData[field].forEach((item) => {
            if (item instanceof File) {
              dataToSend.append(field, item);
            } else if (typeof item === "string") {
              dataToSend.append(field, item);
            }
          });
        }
      });

      await dispatch(saveGalleryToBackend(dataToSend)).unwrap();
      await dispatch(fetchGalleryData());
    }
    setIsEditable(!isEditable);
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Gallery Management
      </Typography>
      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          <form onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Gallery Info"
              name="gallery_info"
              variant="outlined"
              value={formData.gallery_info || ""}
              onChange={handleChange}
              disabled={!isEditable}
            />
            <JoditEditor
              value={formData.gallery_description || ""}
              config={{ readonly: !isEditable }}
              onBlur={(newContent) =>
                setFormData({ ...formData, gallery_description: newContent })
              }
            />
            {["birthplace_media", "events_media", "exhibitions_media", "online_media"].map((field) => (
              <Box key={field}>
                <Typography variant="h6">{field.replace("_", " ")}</Typography>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, field)}
                  disabled={!isEditable}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {formData[field]?.map((image, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <Avatar
                        src={image instanceof File ? URL.createObjectURL(image) : image}
                        alt={field}
                        sx={{ width: 100, height: 100, borderRadius: 2 }}
                      />
                      {isEditable && (
                        <IconButton onClick={() => handleImageRemove(field, index)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
            <Button type="submit" variant="contained" color="primary">
              {isEditable ? "Save" : "Edit"}
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Gallery;
