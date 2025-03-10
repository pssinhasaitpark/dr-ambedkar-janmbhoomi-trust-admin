import React, { useState, useRef, useEffect} from "react";
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
  fetchBooksData,
  saveBooksToBackend,
} from "../../redux/slice/bookSlice";


const Books = () => {
  const dispatch = useDispatch();
  const booksData = useSelector((state) => state.books) || {};
  const editor = useRef(null);
 const descriptionRef = useRef(""); 
  const [title, setTitle] = useState("Books");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false); 
   const status = useSelector((state) => state.about.status);
   const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
     dispatch(fetchBooksData());
  }, [dispatch]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }, []);

  useEffect(() => { 
      setTitle(booksData?.title || "");
      setName(booksData?.name || "");
      setDescription(booksData?.description || "");
      descriptionRef.current = booksData?.description || ""; 
      setSelectedImages(booksData?.images || []); 
  },  [
    booksData?.title,
    booksData?.name,
    booksData?.description,
    booksData?.images
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
      const descriptionContent = descriptionRef.current || "No description provided"; //  Get latest content from ref

      const booksDataToSend = {
        title,
        name,
        description: descriptionContent,
        images: selectedImages,
        removeImages: removeImages.length > 0 ? removeImages : [],
      };

      try {
        await dispatch(
          saveBooksToBackend({
            id: booksData._id,
            booksData: booksDataToSend,
          })
        );
         const updatedData = await dispatch(fetchBooksData()).unwrap();
                 setDescription(updatedData.description || descriptionContent); // Update state with saved data
                 descriptionRef.current = updatedData.description || descriptionContent; //  Sync ref with saved data
        setRemoveImages([]);
         dispatch(fetchBooksData());
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

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
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
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold",mt:8 }}>
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
              Book Description
            </Typography>

            <JoditEditor
              ref={editor}
              value={description}
              config={{
                readonly: !isEditable,
                height: 500,
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
              Upload Book Cover
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full view"
              style={{  maxHeight: "100%", objectFit: "contain" }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Books;
