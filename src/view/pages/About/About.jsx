import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAboutData,
  saveAboutToBackend,
} from "../../redux/slice/aboutSlice";

const About = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector((state) => state.about) || {};

  const editor = useRef(null);
  const biographyRef = useRef(""); // ✅ Store real-time content without re-renders

  const [title, setTitle] = useState("About");
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch about data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchAboutData());
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [dispatch]);

  // Populate state when data is available
  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || "About");
      setName(aboutData.name || "");
      setBiography(aboutData.biography || "");
      biographyRef.current = aboutData.biography || ""; // ✅ Initialize ref with existing data
      setSelectedImages(aboutData.images || []);
    }
  }, [aboutData]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  // Handle image removal
  const handleImageRemove = (index) => {
    const imageToRemove = selectedImages[index];
    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle edit/save functionality
  const handleEditSave = async (e) => {
    e.preventDefault();

    if (isEditable) {
      const biographyContent = biographyRef.current || "No biography provided"; // ✅ Get latest content from ref

      const aboutDataToSend = {
        title,
        name,
        biography: biographyContent,
        images: selectedImages,
        removeImages: removeImages.length > 0 ? removeImages : [],
      };

      try {
        await dispatch(
          saveAboutToBackend({
            id: aboutData._id,
            aboutData: aboutDataToSend,
          })
        );

        const updatedData = await dispatch(fetchAboutData()).unwrap();
        setBiography(updatedData.biography || biographyContent); // ✅ Update state with saved data
        biographyRef.current = updatedData.biography || biographyContent; // ✅ Sync ref with saved data
        setRemoveImages([]);
      } catch (error) {
        console.error("Error saving/updating data: ", error);
      }
    }

    setIsEditable(!isEditable);
  };

  // Render image source
  const renderImageSource = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string") {
      return image;
    }
    return "";
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", mt: 8 }}>
        {title}
      </Typography>
      <Paper sx={{ p: 0, borderRadius: 0, boxShadow: 0 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleEditSave}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Biography
            </Typography>

            <JoditEditor
              ref={editor}
              value={biography}
              config={{
                readonly: !isEditable,
                height: 300,
                uploader: {
                  insertImageAsBase64URI: true, // ✅ Enables drag-and-drop image upload as base64
                },
                filebrowser: {
                  ajax: {
                    url: "/upload", // Change this if you have a backend API to store images
                  },
                },
                image: {
                  openOnDblClick: true,
                  editSrc: true,
                  allowDragAndDropFileToEditor: true, // ✅ Enables dragging images into the editor
                },
                toolbarSticky: false,
              }}
              onChange={(newContent) => (biographyRef.current = newContent)}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Upload Profile Images
            </Typography>
            {isEditable && (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginBottom: "1rem" }}
              />
            )}
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", mt: 2 }}>
              {selectedImages.map((image, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <Avatar
                    src={renderImageSource(image)}
                    sx={{ width: 100, height: 100 }}
                  />
                  {isEditable && (
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        backgroundColor: "white",
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained">
                {isEditable ? "Save" : "Edit"}
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default About;
