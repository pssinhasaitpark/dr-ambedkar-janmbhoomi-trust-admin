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
} from "@mui/material";
import { Edit, Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventData, saveEventToBackend } from "../../redux/slice/eventSlice";

const Event = () => {
  const dispatch = useDispatch();
  const eventData = useSelector((state) => state.events);

  const [title, setTitle] = useState("Event Title");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const editor = useRef(null);

  useEffect(() => {
    dispatch(fetchEventData());
  }, [dispatch]);

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || "Event Title");
      setName(eventData.name || "");
      setDescription(eventData.description || "");
      setSelectedImages(eventData.images || []);
    }
  }, [eventData]);

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
      const eventDataToSend = {
        title,
        name,
        description,
        images: selectedImages,
      };

      try {
        await dispatch(saveEventToBackend({ id: eventData._id, eventData: eventDataToSend }));
      } catch (error) {
        console.error("Error saving/updating data: ", error);
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
              Description
            </Typography>

            <JoditEditor
              ref={editor}
              value={description}
              config={{
                readonly: !isEditable,
                placeholder: "Write about the event...",
              }}
              onBlur={(newContent) => setDescription(newContent)}
            />

            <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Event Images
              </Typography>
              <IconButton color="primary" component="label">
                <input hidden accept="image/*" type="file" onChange={handleImageUpload} multiple />
                <Edit />
              </IconButton>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {selectedImages.map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <Avatar
                      src={image instanceof File ? URL.createObjectURL(image) : image}
                      alt={`Event Image ${index + 1}`}
                      sx={{ width: 100, height: 100, borderRadius: 2 }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{ position: "absolute", top: 2, right: 2, backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              {isEditable ? "Save" : "Edit"}
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Event;