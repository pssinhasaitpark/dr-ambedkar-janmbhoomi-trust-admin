import React, { useState, useRef, useEffect, useCallback } from "react";
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
import debounce from "lodash.debounce";

const About = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector((state) => state.about) || {};
  const editor = useRef(null);
  const [title, setTitle] = useState("About");
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      await dispatch(fetchAboutData());

      // Delay to ensure at least one complete circle is shown
      setTimeout(() => {
        setLoading(false); // Set loading to false after fetching
      }, 500); // Adjust the delay as needed (500ms in this case)
    };
    fetchData();
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchAboutData());
  // }, [dispatch]);

  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || "About");
      setName(aboutData.name || "");
      setBiography(aboutData.biography || "");
      setSelectedImages(aboutData.images || []);
    }
  }, [aboutData]);

  const debouncedEditorChange = useCallback(
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
    const imageToRemove = selectedImages[index];
    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (isEditable) {
      const aboutDataToSend = {
        title,
        name,
        biography: biography?.trim() || "No biography provided",
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
        setRemoveImages([]);
        dispatch(fetchAboutData()); // Fetch latest data instead of reloading
      } catch (error) {
        console.error("Error saving/updating data: ", error);
      }
    }
    setIsEditable(!isEditable);
  };

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
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        {loading ? ( // Show loading indicator while fetching
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
              onBlur={(newContent) => setBiography(newContent?.trim() || "")}
              config={{
                readonly: !isEditable,
                height: 300,
                style: {
                  overflow: "auto",
                },
                uploader: {
                  insertImageAsBase64URI: true,
                  url: "/upload",
                  format: "json",
                },
              }}
              style={{
                maxHeight: "300px",
                overflow: "auto",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
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
