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
  fetchEventsData,
  saveEventsToBackend,
} from "../../redux/slice/eventSlice";

const Events = () => {
  const dispatch = useDispatch();
  const eventsData = useSelector((state) => state.events) || {};
  const editor = useRef(null);
  const descriptionRef = useRef(""); // Store real-time content without re-renders

  const [title, setTitle] = useState("Events");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchEventsData());
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (eventsData) {
      setTitle(eventsData.title || "Events");
      setName(eventsData.name || "");
      setDescription(eventsData.description || "");
      descriptionRef.current = eventsData.description || ""; // Initialize ref with existing data
      setSelectedImages(eventsData.images || []);
    }
  }, [eventsData]);

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
      const descriptionContent =
        descriptionRef.current || "No description provided"; //  Get latest content from ref

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
        setDescription(updatedData.description || descriptionContent); // ✅ Update state with saved data
        descriptionRef.current = updatedData.description || descriptionContent; // ✅ Sync ref with saved data
        setRemoveImages([]);
        // dispatch(fetchEventsData());
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
              Event Description
            </Typography>

            <JoditEditor
              ref={editor}
              value={description}
              config={{
                readonly: !isEditable,
                height: 300,
                uploader: {
                  insertImageAsBase64URI: true, // Enables drag-and-drop image upload as base64
                },
                filebrowser: {
                  ajax: {
                    url: "/upload", // Change this if you have a backend API to store images
                  },
                },
                image: {
                  openOnDblClick: true,
                  editSrc: true,
                  allowDragAndDropFileToEditor: true, // Enables dragging images into the editor
                },
                toolbarSticky: false,
              }}
              onChange={(newContent) => (descriptionRef.current = newContent)}
            />

            {/* <JoditEditor
  ref={editor}
  value={description}
  config={{
    readonly: !isEditable,
    placeholder: "Write about Atal's life...",
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
        "hr", // ✅ Horizontal Ruler
        "line", // ✅ Line tool
        "code",
        "fullsize",
        "undo",
        "redo",
        "|",
        {
          name: "ruler", // ✅ Custom Ruler Button
          iconURL: "https://cdn-icons-png.flaticon.com/512/992/992703.png",
          exec: (editor) => {
            editor.s.insertHTML(
              `<div style="border-top: 2px solid black; margin: 10px 0;"></div>`
            );
          },
          tooltip: "Insert Ruler",
        },
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
  onBlur={(newContent) => setDescription(newContent?.trim() || "")}
/> */}

            <Typography variant="h6" sx={{ mt: 2 }}>
              Upload Event Images
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

export default Events;
