import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, IconButton, Avatar, Divider } from "@mui/material";
import { Edit } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { saveAboutToBackend, fetchAboutData } from "../../redux/slice/aboutSlice";
import debounce from "lodash.debounce";

const About = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector((state) => state.about);
  
  const [title, setTitle] = useState(aboutData.title || "About Dr. Ambedkar");
  const [name, setName] = useState(aboutData.name || "Dr. Bhimrao Ambedkar");
  const [biography, setBiography] = useState(aboutData.biography || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(aboutData.images?.[0]?.url || null); // Use the first image URL from Redux state
  const [isEditable, setIsEditable] = useState(false);
  const [error, setError] = useState("");
  const editor = useRef(null);

  // Fetch the data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch to fetch data from the backend
        await dispatch(fetchAboutData());
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchData();
  }, [dispatch]); // Ensure the fetch happens on page load

  // Handle change for form fields
  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    if (file) {
      if (file.size > maxSize) {
        setError("File size should be less than 10MB.");
        return;
      }
      setError(""); // Clear error if file is valid
      setSelectedImage(file); // Store the actual file object

      // Create a preview of the image
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleDeleteBiography = () => {
    setBiography("");
  };

  const handleEditorChange = debounce((newContent) => {
    setBiography(newContent);
  }, 500); // Reduced debounce time to 500ms for quicker updates

  const handleSave = async (e) => {
    e.preventDefault();

    const aboutDataToSend = new FormData();
    aboutDataToSend.append("title", title);
    aboutDataToSend.append("name", name);
    aboutDataToSend.append("biography", biography);

    if (selectedImage) {
      aboutDataToSend.append("images", selectedImage);
    }

    try {
      await dispatch(saveAboutToBackend(aboutDataToSend));
      setIsEditable(false); // Disable edit mode after saving
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleUpdate = () => {
    setIsEditable(true); // Set editable to true to allow changes
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>

      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          {/* Profile Image Upload */}
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={imagePreview || (selectedImage ? URL.createObjectURL(selectedImage) : '')}
              alt={name}
              sx={{ width: 120, height: 120, mb: 1, mx: "auto" }}
            />
            <IconButton color="primary" component="label">
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
              <Edit />
            </IconButton>
            {error && <Typography color="error">{error}</Typography>} {/* Display error if any */}
          </Box>

          {/* Form Fields */}
          <form onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => handleChange(e, setTitle)}
              disabled={!isEditable}
              sx={{ mb: 2 }} // Added margin
            />

            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => handleChange(e, setName)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Biography
            </Typography>

            <JoditEditor
              ref={editor}
              value={biography}
              config={{
                readonly: !isEditable,
                placeholder: "Write about Dr. Ambedkar...",
                height: 300,
                cleanOnPaste: false,
                cleanOnChange: false,
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
                  url: "/upload",
                  format: "json",
                },
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={handleEditorChange}
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
                Update Biography
              </Button>
            </Box>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default About;
