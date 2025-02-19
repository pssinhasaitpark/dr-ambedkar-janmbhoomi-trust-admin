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
import { Edit, Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewsData,
  saveNewsToBackend,
} from "../../redux/slice/newsSlice";
import debounce from "lodash.debounce";

const News = () => {
  const dispatch = useDispatch();
  const newsData = useSelector((state) => state.news) || {};

  const editor = useRef(null);

  const [title, setTitle] = useState("News");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    dispatch(fetchNewsData());
  }, [dispatch]);

  useEffect(() => {
    if (newsData) {
      setTitle(newsData.title || "News");
      setHeadline(newsData.headline || "");
      setDescription(newsData.description || "");
      setSelectedImages(newsData.images || []);
    }
  }, [newsData]);

  const debouncedEditorChange = useCallback(
    debounce((newContent) => {
        setDescription(newContent);
    }, 3000),
    []
  );

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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("headline", headline);
      formData.append("description", description);

      selectedImages.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      try {
        await dispatch(saveNewsToBackend(formData)).unwrap();
        await dispatch(fetchNewsData());
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
    setIsEditable(!isEditable);
  };

  return (
    <Box sx={{ p: 5 }}>
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
              label="Headline"
              variant="outlined"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 2 }}>
            description
            </Typography>

            <JoditEditor
              ref={editor}
              value={description}
              config={{
                readonly: !isEditable,
                placeholder: "Write the news description...",
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
                    "line",
                    "code",
                    "fullsize",
                    "undo",
                    "redo",
                  ],
                },
                uploader: {
                  insertImageAsBase64URI: true,
                },
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={debouncedEditorChange}
              onBlur={(newContent) => setDescription(newContent)}
            />

            <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload News Images
              </Typography>
              <IconButton color="primary" component="label">
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <Edit />
              </IconButton>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {selectedImages.map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <Avatar
                      src={
                        image instanceof File ? URL.createObjectURL(image) : image
                      }
                      alt={`News ${index + 1}`}
                      sx={{ width: 100, height: 100, borderRadius: 2 }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default News;
