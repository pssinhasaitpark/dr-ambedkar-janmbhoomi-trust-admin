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
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGalleryData,
  saveGalleryToBackend,
} from "../../redux/slice/gallerySlice";
import debounce from "lodash.debounce";

const Gallery = () => {
  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.gallery) || {};
  const editor = useRef(null);

  const [gallery_info, setGalleryInfo] = useState("Gallery");
  const [gallery_description, setGalleryDescription] = useState("");
  const [media, setMedia] = useState({
    birthplace_media: [],
    events_media: [],
    exhibitions_media: [],
    online_media: [],
  });
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    dispatch(fetchGalleryData());
  }, [dispatch]);

  useEffect(() => {
    if (galleryData) {
      setGalleryInfo(galleryData.gallery_info || "Gallery");
      setGalleryDescription(galleryData.gallery_description || "");
      setMedia({
        birthplace_media: galleryData.birthplace_media || [],
        events_media: galleryData.events_media || [],
        exhibitions_media: galleryData.exhibitions_media || [],
        online_media: galleryData.online_media || [],
      });
    }
  }, [galleryData]);

  const debouncedEditorChange = useCallback(
    debounce((newContent) => {
      setGalleryDescription(newContent);
    }, 3000),
    []
  );

  const handleImageUpload = (event, category) => {
    const files = Array.from(event.target.files);
    setMedia((prev) => ({
      ...prev,
      [category]: [...prev[category], ...files],
    }));
  };

  const handleImageRemove = (category, index) => {
    const imageToRemove = media[category][index];
    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }
    setMedia((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (isEditable) {
      const galleryDataToSend = {
        gallery_info,
        gallery_description:
          gallery_description?.trim() || "No description provided",
        ...media,
        removeImages: removeImages.length > 0 ? removeImages : [],
      };
      try {
        await dispatch(
          saveGalleryToBackend({
            id: galleryData._id,
            galleryData: galleryDataToSend,
          })
        );
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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}></Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleEditSave}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Gallery Info
          </Typography>
          <JoditEditor
            ref={editor}
            value={gallery_info}
            config={{
              readonly: !isEditable,
              placeholder: "Enter gallery info...",
            }}
            onChange={debounce(
              (newContent) => setGalleryInfo(newContent),
              3000
            )}
            onBlur={(newContent) =>
              setGalleryInfo(newContent?.trim() || "Gallery")
            }
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Gallery Description
          </Typography>

          <JoditEditor
            ref={editor}
            value={gallery_description}
            config={{
              readonly: !isEditable,
              placeholder: "Write about gallery...",
              uploader: {
                insertImageAsBase64URI: true, // Allows base64 image upload (local handling)
              },
              filebrowser: {
                ajax: {
                  url: "/upload", // Backend API for image uploads (update this if needed)
                },
                insertImageAsBase64URI: true, // Allows pasting images directly as base64
              },
            }}
            onChange={debouncedEditorChange}
            onBlur={(newContent) =>
              setGalleryDescription(newContent?.trim() || "")
            }
          />

          {Object.keys(media).map((category) => (
            <Box key={category} sx={{ mt: 3 }}>
              <Typography variant="h6">{category.replace("_", " ")}</Typography>
              {isEditable && (
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => handleImageUpload(event, category)}
                />
              )}
              <Stack
                direction="row"
                spacing={2}
                sx={{ flexWrap: "wrap", mt: 2 }}
              >
                {media[category].map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <Avatar
                      src={renderImageSource(image)}
                      sx={{ width: 100, height: 100 }}
                    />
                    {isEditable && (
                      <IconButton
                        onClick={() => handleImageRemove(category, index)}
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
            </Box>
          ))}

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

export default Gallery;
