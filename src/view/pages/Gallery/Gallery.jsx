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
  Modal,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGalleryData,
  saveGalleryToBackend,
} from "../../redux/slice/gallerySlice";

const Gallery = () => {
  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.gallery) || {};

  const infoEditorRef = useRef(""); // Gallery Info Ref
  const descriptionEditorRef = useRef(""); // Gallery Description Ref

  const [loading, setLoading] = useState(true);
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
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [openModal, setOpenModal] = useState(false); // State for modal visibility

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
      const infoContent = infoEditorRef.current || "No Info provided";
      const descriptionContent = descriptionEditorRef.current || "No description provided";

      const galleryDataToSend = {
        gallery_info: infoContent,
        gallery_description: descriptionContent,
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

        const updatedData = await dispatch(fetchGalleryData()).unwrap();
        setGalleryInfo(updatedData.gallery_info || infoContent);
        setGalleryDescription(updatedData.gallery_description || descriptionContent);
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const handleViewMore = (category) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: true,
    }));
  };

  const handleViewLess = (category) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: false,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Gallery
      </Typography>
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
            <Typography variant="h6" sx={{ mt: 2 }}>
              Gallery Info
            </Typography>

            <JoditEditor
              ref={infoEditorRef}
              value={gallery_info}
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
              onChange={(newContent) => (infoEditorRef.current = newContent)}
            />

            {/* Gallery Description */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Gallery Description
            </Typography>

            <JoditEditor
              ref={descriptionEditorRef}
              value={gallery_description}
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
              onChange={(newContent) => (descriptionEditorRef.current = newContent)}
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
                  {media[category]
                    .slice(0, expandedSections[category] ? media[category].length : 5)
                    .map((image, index) => (
                      <Box key={index} sx={{ position: "relative" }}>
                        <Avatar
                          src={renderImageSource(image)}
                          sx={{ width: 100, height: 100, cursor: "pointer" }}
                          onClick={() => handleImageClick(renderImageSource(image))}
                        />
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
                {media[category].length > 5 && !expandedSections[category] && (
                  <Button onClick={() => handleViewMore(category)} sx={{ mt: 2 }}>
                    View More
                  </Button>
                )}
                {expandedSections[category] && (
                  <Button onClick={() => handleViewLess(category)} sx={{ mt: 2 }}>
                    View Less
                  </Button>
                )}
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

      {/* Modal for Full Image View */}
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

export default Gallery;