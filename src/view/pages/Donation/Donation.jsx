import React, { useState, useRef, useEffect,useCallback } from "react";
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
import { Edit, Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDonationData,
  saveDonationToBackend,
} from "../../redux/slice/donationSlice";
import debounce from "lodash.debounce";

const Donation = () => {
  const dispatch = useDispatch();
  const donationData = useSelector((state) => state.donation) || {};

  const [title, setTitle] = useState(donationData.title || "Donation");
  const [name, setName] = useState(donationData.name || "");
  const [description, setDescription] = useState(donationData.description || "");
  const [selectedImages, setSelectedImages] = useState(donationData.images || []);
  const [isEditable, setIsEditable] = useState(false);

  const editor = useRef(null);

  useEffect(() => {
    dispatch(fetchDonationData());
  }, [dispatch]);

  useEffect(() => {
    setTitle(donationData.title || "Donation");
    setName(donationData.name || "");
    setDescription(donationData.description || "");
    setSelectedImages(donationData.images || []);
  }, [donationData]);

  const debouncedEditorChange = useCallback(
    debounce((newContent) => {
      setDescription(newContent);
    }, 3000),
    []
  );
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleImageRemove = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (isEditable) {
      const donationDataToSend = new FormData();
      donationDataToSend.append("title", title);
      donationDataToSend.append("name", name);
      donationDataToSend.append("description", description);
      selectedImages.forEach((image) => {
        donationDataToSend.append("images", image);
      });
      try {
        await dispatch(saveDonationToBackend(donationDataToSend));
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
    setIsEditable(!isEditable);
  };

  return (
    
    <Box sx={{ p: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          <form onSubmit={handleEditSave}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Description
            </Typography>
            <JoditEditor
              ref={editor}
              value={description}
              config={{
                readonly: !isEditable,
                placeholder: "Write about Dr. Ambedkar's life...",
                height: 400,
                cleanOnPaste: false, // Retain styles when pasting
                cleanOnChange: false, // Retain the HTML structure while editing
                toolbar: {
                  items: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "eraser",
                    "|",
                    "font",
                    "fontsize",
                    "paragraph",
                    "|",
                    "align",
                    "outdent",
                    "indent",
                    "|",
                    "link",
                    "image",
                    "video",
                    "table",
                    "line",
                    "code",
                    "fullsize",
                    "undo",
                    "redo",
                  ],
                },
                uploader: {
                  insertImageAsBase64URI: true,
                  url: "/upload", // Define your upload endpoint
                  format: "json",
                },
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={debouncedEditorChange} // Update immediately
              onBlur={(newContent) => setDescription(newContent)} // Ensure update on blur
            />
            <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Donation Images
              </Typography>
              <IconButton color="primary" component="label">
                <input hidden accept="image/*" multiple type="file" onChange={handleImageUpload} />
                <Edit />
              </IconButton>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {selectedImages.map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <Avatar
                      src={image instanceof File ? URL.createObjectURL(image) : image}
                      alt={`Donation ${index + 1}`}
                      sx={{ width: 100, height: 100, borderRadius: 2 }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{ position: "absolute", top: 2, right: 2, backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              {isEditable ? "Save" : "Edit"}
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Donation;