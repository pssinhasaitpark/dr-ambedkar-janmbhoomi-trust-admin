import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
  fetchAboutData,
  saveAboutToBackend,
} from "../../redux/slice/aboutSlice";
import debounce from "lodash.debounce";

const About = () => {
  const dispatch = useDispatch();
  
  // Memoizing `aboutData` to prevent unnecessary re-renders
  const aboutData = useSelector((state) => state.about);
  const memoizedAboutData = useMemo(() => aboutData, [aboutData]);

  const [title, setTitle] = useState(memoizedAboutData.title || "About");
  const [name, setName] = useState(memoizedAboutData.name || "");
  const [biography, setBiography] = useState(memoizedAboutData.biography || "");
  const [selectedImages, setSelectedImages] = useState(memoizedAboutData.images || []);
  const [isEditable, setIsEditable] = useState(false);

  const editor = useRef(null);

  useEffect(() => {
    dispatch(fetchAboutData());
  }, [dispatch]);

  useEffect(() => {
    setTitle(memoizedAboutData.title || "About");
    setName(memoizedAboutData.name || "");
    setBiography(memoizedAboutData.biography || "");
    setSelectedImages(memoizedAboutData.images || []);
  }, [memoizedAboutData]);

  // Move debounce function outside useCallback to avoid unnecessary recreation
  const debouncedEditorChange = useCallback(
    () =>
      debounce((newContent) => {
        setBiography(newContent);
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
      const aboutDataToSend = new FormData();
      aboutDataToSend.append("title", title);
      aboutDataToSend.append("name", name);
      aboutDataToSend.append("biography", biography);
      selectedImages.forEach((image) => {
        aboutDataToSend.append("images", image);
      });
      try {
        await dispatch(saveAboutToBackend(aboutDataToSend));
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
    setIsEditable(!isEditable);
  };

  return (
    <Box sx={{ p: 2 }}>
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
              Biography
            </Typography>

            <JoditEditor
              ref={editor}
              value={biography}
              config={{
                readonly: !isEditable,
                placeholder: "Write about Dr. Ambedkar's life...",
                height: 400,
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
              onChange={debouncedEditorChange}
              onBlur={(newContent) => setBiography(newContent)}
            />

            <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Profile Image
              </Typography>
              <IconButton color="primary" component="label">
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                />
                <Edit />
              </IconButton>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {selectedImages.map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <Avatar
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt={`Profile ${index + 1}`}
                      sx={{ width: 100, height: 100, borderRadius: 2 }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default About;
