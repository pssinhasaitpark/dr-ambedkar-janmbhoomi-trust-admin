import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
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
  fetchGalleryData,
  saveGalleryToBackend,
} from "../../redux/slice/gallerySlice";
import debounce from "lodash.debounce";

const Gallery = () => {
  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.gallery) || {};

  // Separate Refs for Editors
  const infoEditorRef = useRef(null);
  const descriptionEditorRef = useRef(null);
  const [loading, setLoading] = useState(true); // Loading state
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

  // Debounce the description state update
  // const debouncedSetGalleryDescription = useRef(
  //   debounce((content) => setGalleryDescription(content), 1000)
  // ).current;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchGalleryData());
 
      setTimeout(() => {
        setLoading(false); 
      }, 500); 
    };
    fetchData();
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
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>Gallery</Typography>
      <Paper sx={{ p: 3, borderRadius: 0, boxShadow: 0 }}>
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
          {/* Gallery Info */}
          <Typography variant="h6" sx={{ mt: 2 }}>Gallery Info</Typography>
          <JoditEditor
            ref={infoEditorRef}
            value={gallery_info}
            config={{ readonly: !isEditable, placeholder: "Enter gallery info..." }}
            onBlur={(newContent) => setGalleryInfo(newContent?.trim() || "Gallery")}
          />

          {/* Gallery Description */}
          <Typography variant="h6" sx={{ mt: 2 }}>Gallery Description</Typography>
          {/* <JoditEditor
            ref={descriptionEditorRef}
            value={gallery_description}
            config={{
              readonly: !isEditable,
              placeholder: "Write about gallery...",
              uploader: { insertImageAsBase64URI: true },
            }}
            onChange={(newContent) => debouncedSetGalleryDescription(newContent)}
            onBlur={(newContent) => setGalleryDescription(newContent?.trim() || "")}
          /> */}
           <JoditEditor
            ref={infoEditorRef}
            value={gallery_description}
            config={{ readonly: !isEditable, placeholder: "Enter gallery info..." }}
            onBlur={(newContent) => setGalleryDescription(newContent?.trim() || "Gallery")}
          />

          {/* Media Upload */}
          {Object.keys(media).map((category) => (
            <Box key={category} sx={{ mt: 3 }}>
              <Typography variant="h6">{category.replace("_", " ")}</Typography>
              {isEditable && (
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => {
                    const files = Array.from(event.target.files);
                    setMedia((prev) => ({
                      ...prev,
                      [category]: [...prev[category], ...files],
                    }));
                  }}
                />
              )}
              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", mt: 2 }}>
                {media[category].map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <Avatar src={renderImageSource(image)} sx={{ width: 100, height: 100 }} />
                    {isEditable && (
                      <IconButton
                        onClick={() => {
                          if (typeof media[category][index] === "string") {
                            setRemoveImages((prev) => [...prev, media[category][index]]);
                          }
                          setMedia((prev) => ({
                            ...prev,
                            [category]: prev[category].filter((_, i) => i !== index),
                          }));
                        }}
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

          {/* Save/Edit Button */}
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

export default Gallery;
