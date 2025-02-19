import React, { useState, useEffect, useRef } from "react";
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
import { Edit } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { saveAboutToBackend, fetchAboutData } from "../../redux/slice/aboutSlice";
import debounce from "lodash.debounce";

const About = () => {
  const dispatch = useDispatch();
  const Biographydata = useSelector((state) => state.about);

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [bioText, setBioText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [fileError, setFileError] = useState("");

  const editor = useRef(null);

  useEffect(() => {
    dispatch(fetchAboutData());
  }, [dispatch]);

  useEffect(() => {
    if (Biographydata.title) setTitle(Biographydata.title);
    if (Biographydata.name) setName(Biographydata.name);
    if (Biographydata.biography) setBioText(Biographydata.biography);
    if (Biographydata.image_urls && Biographydata.image_urls.length > 0) {
      setImagePreview(Biographydata.image_urls[0]);
    }
  }, [Biographydata]);

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    if (file) {
      if (file.size > maxSize) {
        setFileError("File size should be less than 10MB.");
        return;
      }
      setFileError("");
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleEditorChange = debounce((newContent) => {
    setBioText(newContent);
  }, 500);

  const handleSaveOrEdit = async () => {
    if (isEditable) {
      // If in edit mode, save changes
      const aboutDataToSend = new FormData();
      aboutDataToSend.append("title", title);
      aboutDataToSend.append("name", name);
      aboutDataToSend.append("biography", bioText);
      if (selectedImage) aboutDataToSend.append("images", selectedImage);

      try {
        await dispatch(saveAboutToBackend(aboutDataToSend));
        setIsEditable(false);
      } catch (err) {
        console.error("Error saving data:", err);
      }
    } else {
      // If not in edit mode, switch to edit mode
      setIsEditable(true);
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={imagePreview}
              alt={name}
              sx={{ width: 120, height: 120, mb: 1, mx: "auto" }}
            />
            <IconButton color="primary" component="label">
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
              <Edit />
            </IconButton>
            {fileError && <Typography color="error">{fileError}</Typography>}
          </Box>

          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => handleChange(e, setTitle)}
            disabled={!isEditable}
            sx={{ mb: 2 }}
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
            key={bioText}
            ref={editor}
            value={bioText}
            config={{
              readonly: !isEditable,
              placeholder: "Write about Dr. Ambedkar's life...",
              height: 400,
              cleanOnPaste: false,
              cleanOnChange: false,
            }}
            style={{ width: "100%", minHeight: "200px" }}
            onChange={handleEditorChange}
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveOrEdit}
              sx={{ width: "50%" }}
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default About;
