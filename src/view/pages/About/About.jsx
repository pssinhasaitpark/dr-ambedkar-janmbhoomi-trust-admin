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
  Modal,
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
  const biographyRef = useRef(""); 

  const [title, setTitle] = useState("About");
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false); 
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


  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || "About");
      setName(aboutData.name || "");
      setBiography(aboutData.biography || "");
      biographyRef.current = aboutData.biography || "";
      setSelectedImages(aboutData.images || []);
    }
  }, [aboutData]);

  
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

  // Handle edit/save functionality
  const handleEditSave = async (e) => {
    e.preventDefault();

    if (isEditable) {
      const biographyContent = biographyRef.current || "No biography provided"; 

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
        setBiography(updatedData.biography || biographyContent);
        biographyRef.current = updatedData.biography || biographyContent; 
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
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
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
                  insertImageAsBase64URI: true, 
                },
                filebrowser: {
                  ajax: {
                    url: "/upload", 
                  },
                },
                image: {
                  openOnDblClick: true,
                  editSrc: true,
                  allowDragAndDropFileToEditor: true, 
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
                    onClick={() => handleImageClick(renderImageSource(image))}
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
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "50%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full view"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default About;
