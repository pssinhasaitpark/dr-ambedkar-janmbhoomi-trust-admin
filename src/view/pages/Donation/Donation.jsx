import React, { useState, useRef } from "react";
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
import { saveDonationToBackend } from "../../redux/slice/donationSlice";
import debounce from "lodash.debounce";

const Donation = () => {
  const dispatch = useDispatch();
  const donationData = useSelector((state) => state.donation) || {};

  const [title, setTitle] = useState(
    localStorage.getItem("donationTitle") || donationData.title || "Donation"
  );
  const [name, setName] = useState(
    localStorage.getItem("donorName") || donationData.name || ""
  );
  const [description, setDescription] = useState(
    localStorage.getItem("donationDescription") ||
      donationData.description ||
      ""
  );
  const [selectedImages, setSelectedImages] = useState(
    JSON.parse(localStorage.getItem("donationImages")) || []
  );
  const [isEditable, setIsEditable] = useState(false);

  const editor = useRef(null);

  const handleChange = (event, setter, storageKey) => {
    setter(event.target.value);
    localStorage.setItem(storageKey, event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const updatedImages = [...selectedImages, ...files];
    setSelectedImages(updatedImages);
    localStorage.setItem(
      "donationImages",
      JSON.stringify(updatedImages.map((file) => URL.createObjectURL(file)))
    );
  };

  const handleImageRemove = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    localStorage.setItem("donationImages", JSON.stringify(updatedImages));
  };

  const handleEditorChange = debounce((newContent) => {
    setDescription(newContent);
    localStorage.setItem("donationDescription", newContent);
  }, 500);

  const handleSave = async (e) => {
    e.preventDefault();

    const donationDataToSend = new FormData();
    donationDataToSend.append("title", title);
    donationDataToSend.append("name", name);
    donationDataToSend.append("description", description);

    selectedImages.forEach((image) => {
      donationDataToSend.append("images", image);
    });

    try {
      await dispatch(saveDonationToBackend(donationDataToSend));
      setIsEditable(false);
    } catch (error) {
      console.error("Error saving donation data: ", error);
    }
  };

  const handleUpdate = () => {
    setIsEditable(true);
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>

      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          <form onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Donation Title"
              variant="outlined"
              value={title}
              onChange={(e) => handleChange(e, setTitle, "donationTitle")}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Donor Name"
              variant="outlined"
              value={name}
              onChange={(e) => handleChange(e, setName, "donorName")}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Donation Description
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
              onChange={handleEditorChange} // Update state on content change
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isEditable}
                sx={{ width: "48%" }}
              >
                Save
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleUpdate}
                sx={{ width: "48%" }}
              >
                Update Details
              </Button>
            </Box>
          </form>
        </Stack>
      </Paper>

      <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Donation Images
        </Typography>
        <IconButton color="primary" component="label">
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={handleImageUpload}
          />
          <Edit />
        </IconButton>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 2,
            mt: 2,
          }}
        >
          {selectedImages.map((image, index) => (
            <Box key={index} sx={{ textAlign: "center", position: "relative" }}>
              <Avatar
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Donation ${index + 1}`}
                sx={{ width: 100, height: 100, borderRadius: 2 }}
              />
              <IconButton
                onClick={() => handleImageRemove(index)}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Donation;
