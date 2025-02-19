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
import {
  fetchBooksData,
  saveBooksToBackend,
} from "../../redux/slice/bookSlice";
import debounce from "lodash.debounce";

const Books = () => {
  const dispatch = useDispatch();
  const booksData = useSelector((state) => state.books) || {};

  const [title, setTitle] = useState(booksData.title || "Books");
  const [name, setName] = useState(booksData.name || "");
  const [description, setDescription] = useState(booksData.description || "");
  const [selectedImages, setSelectedImages] = useState(booksData.images || []);
  const [isEditable, setIsEditable] = useState(false);


  const editor = useRef(null);

  useEffect(() => {
    dispatch(fetchBooksData());
  }, [dispatch]);

  useEffect(() => {
    setTitle(booksData.title || "Books");
    setName(booksData.name || "");
    setDescription(booksData.description || "");
    setSelectedImages(booksData.images || []);
  }, [booksData]);
  // console.log("book image",booksData.images);
  

  const handleEditorChange = debounce((newContent) => {
    setDescription(newContent);
  }, 3000);

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
      const booksDataToSend = new FormData();
      booksDataToSend.append("title", title);
      booksDataToSend.append("name", name);
      booksDataToSend.append("description", description);
      selectedImages.forEach((image) => {
        booksDataToSend.append("images", image);
      });
      try {
        await dispatch(saveBooksToBackend(booksDataToSend));
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
    setIsEditable(!isEditable);
  };
  // console.log("selectedImages:",selectedImages);
  // console.log("chech book data",booksData)
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
            {/* <JoditEditor
              ref={editor}
              value={description}
              config={{ readonly: !isEditable, placeholder: "Write about Dr. Ambedkar's life...", height: 400 }}
              onChange={handleEditorChange}
            /> */}

            <JoditEditor
              ref={editor}
              value={description}
              config={{
                readonly: !isEditable,
                placeholder: "Write about Dr. Ambedkar's life...",
                height: 400,
                cleanOnPaste: true, // Retain styles when pasting
                cleanOnChange: false, // Retain the HTML structure while editing
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
                  url: "/upload", // Define your upload endpoint
                  format: "json",
                },
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={handleEditorChange} // Update state on content change
            />
            <Box
              sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Book Images
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
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt={`Book ${index + 1}`}
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

export default Books;