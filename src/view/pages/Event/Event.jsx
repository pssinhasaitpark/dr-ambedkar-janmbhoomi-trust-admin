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
  fetchEventsData,
  saveEventsToBackend,
} from "../../redux/slice/eventSlice";

const Events = () => {
  const dispatch = useDispatch();
  const eventsData = useSelector((state) => state.events) || {};
  const editor = useRef(null);
  const descriptionRef = useRef("");

  const [title, setTitle] = useState("Events");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const status = useSelector((state) => state.about.status);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    dispatch(fetchEventsData());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTitle(eventsData?.title || "");
    setName(eventsData?.name || "");
    setDescription(eventsData?.description || "");
    descriptionRef.current = eventsData?.description || "";
    setSelectedImages(eventsData?.images || []);
  }, [
    eventsData?.title,
    eventsData?.name,
    eventsData?.description,
    eventsData?.images,
  ]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleImageRemove = (index) => {
    const imageToRemove = selectedImages[index];

    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }

    setSelectedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();

    if (isEditable) {
      const descriptionContent =
        descriptionRef.current || "No description provided";

      const eventsDataToSend = {
        title,
        name,
        description: descriptionContent,
        images: selectedImages,
        removeImages: removeImages.length > 0 ? removeImages : [],
      };

      try {
        await dispatch(
          saveEventsToBackend({
            id: eventsData._id,
            eventsData: eventsDataToSend,
          })
        );
        const updatedData = await dispatch(fetchEventsData()).unwrap();
        setDescription(updatedData.description || descriptionContent);
        descriptionRef.current = updatedData.description || descriptionContent;
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
        <CircularProgress />
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
            Event Description
          </Typography>
          <JoditEditor
            ref={editor}
            value={description}
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
            onChange={(newContent) => (descriptionRef.current = newContent)}
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
          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            {selectedImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                }}
              >
                <SlideshowLightbox>
                <img
                    src={renderImageSource(image)}
                    alt={`Uploaded ${index}`}
                    style={{
                      width: "100px", 
                      height: "100px", 
                      objectFit: "cover",
                      borderRadius: "50%",
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
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {isEditable ? "Save" : "Edit"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Events;
