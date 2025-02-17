import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, IconButton, Avatar } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { saveAboutToBackend, updateAbout } from "../../redux/slice/aboutSlice";
import debounce from "lodash.debounce";

const About = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector((state) => state.about);

  // Using localStorage to persist data after refresh
  const [title, setTitle] = useState(localStorage.getItem("title") || aboutData.title);
  const [name, setName] = useState(localStorage.getItem("name") || aboutData.name);
  const [biography, setBiography] = useState(localStorage.getItem("biography") || aboutData.biography);
  const [selectedImage, setSelectedImage] = useState(null);  // Changed to store the file object
  const [isEditable, setIsEditable] = useState(false); // Start with editable as false for 'Update' functionality

  const editor = useRef(null); // JoditEditor reference

  // Update localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("title", title);
    localStorage.setItem("name", name);
    localStorage.setItem("biography", biography);
    if (selectedImage) {
      localStorage.setItem("image_name", selectedImage.name);  // Store image name instead of URL
    }
  }, [title, name, biography, selectedImage]);

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];  // Ensure it is a file object
    if (file) {
      setSelectedImage(file);  // Store the actual File object
    }
  };

  const handleDeleteBiography = () => {
    setBiography("");
  };

  // Debounced editor change handler
  const handleEditorChange = debounce((newContent) => {
    setBiography(newContent);  // Update biography state with editor's content
  }, 500); // Reduced debounce time to 500ms for quicker updates

  const handleSave = async (e) => {
    e.preventDefault();

    const aboutDataToSend = new FormData();
    aboutDataToSend.append("title", title);
    aboutDataToSend.append("name", name);
    aboutDataToSend.append("biography", biography); // Biography as HTML with <p> tags

    if (selectedImage) {
      aboutDataToSend.append("images", selectedImage);  // Send the actual file
    }

    // Log FormData for debugging
    console.log("Sending FormData:");
    aboutDataToSend.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      // Ensure that 'Content-Type' is automatically set for FormData
      await dispatch(saveAboutToBackend(aboutDataToSend)); 
      setIsEditable(false);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleUpdate = () => {
    setIsEditable(true); // Set editable to true to allow changes
  };

  return (
    <Box sx={{ p: 5, mt:5}}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>

      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          {/* Profile Image Upload */}
          <Box sx={{ textAlign: "center" }}>
            <Avatar 
              src={selectedImage ? URL.createObjectURL(selectedImage) : ''} 
              alt={name} 
              sx={{ width: 120, height: 120, mb: 1, mx: "auto" }} 
            />
            <IconButton color="primary" component="label">
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
              <Edit />
            </IconButton>
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
              sx={{ mb: 2 }} // Added margin
            />

            {/* Biography (Jodit Editor) */}
            <Typography variant="h6" sx={{ mb: 2 }}>Biography</Typography> {/* Added margin */}
            <JoditEditor
              ref={editor}
              value={biography}
              config={{
                readonly: !isEditable,
                placeholder: "Write about Dr. Ambedkar's life...",
                height: 400,
                cleanOnPaste: false,  // Retain styles when pasting
                cleanOnChange: false,  // Retain the HTML structure while editing
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={handleEditorChange} // Update state on content change
            />

            {/* Action Buttons */}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={!isEditable}
              sx={{ mb: 2 }} // Added margin
            >
              Save
            </Button>
          </form>

          {/* Update Button */}
          {!isEditable && (
            <Button variant="outlined" color="secondary" fullWidth onClick={handleUpdate}>
              Update
            </Button>
          )}

          <IconButton color="error" onClick={handleDeleteBiography}>
            <Delete />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
};

export default About;
