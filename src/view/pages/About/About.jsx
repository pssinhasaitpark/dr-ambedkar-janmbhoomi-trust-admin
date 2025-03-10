import React, { useState, useRef, useEffect } from "react";
import { SlideshowLightbox } from "lightbox.js-react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
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
  const biographyRef = useRef("");
  const [title, setTitle] = useState("About");
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  // const [loading, setLoading] = useState(true);
  const status = useSelector((state) => state.about.status);
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
dispatch(fetchAboutData());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    setTitle(aboutData?.title || "About");
    setName(aboutData?.name || "");
    setBiography(aboutData?.biography || "");
    biographyRef.current = aboutData?.biography || "";
    setSelectedImages(aboutData?.images || []);
}, [
    aboutData?.title,
    aboutData?.name,
    aboutData?.biography,
    aboutData?.images
]);


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

  const renderImageSource = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string") {
      return image;
    }
    return "";
  };

  if (status === "loading" || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress/>
      </Box>
    );

  if (status === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {status}
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", mt: 8 }}>
        {title}
      </Typography>
      <Paper sx={{ p: 0, borderRadius: 0, boxShadow: 0 }}>
     
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
              Upload Banner Image
            </Typography>
            {selectedImages.length === 0 && isEditable && (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ margin: "20px 0" }}
              />
            )}
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", mt: 2 }}>
              {selectedImages.map((image, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <SlideshowLightbox>
                    <img
                      src={renderImageSource(image)}
                      alt={`Uploaded ${index}`}
                      style={{
                        width: "30%",
                        height: "30%",
                        objectFit: "cover",
                      }}
                    />
                  </SlideshowLightbox>
                  {isEditable && (
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{
                        position: "absolute",
                        top: -10,
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
      </Paper>
    </Box>
  );
};

export default About;
