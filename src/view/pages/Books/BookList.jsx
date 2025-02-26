import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../../redux/slice/booklistSlice";
import JoditEditor from "jodit-react";
import {
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Close,
  Image as ImageIcon,
} from "@mui/icons-material";
import debounce from "lodash.debounce";

function BookList() {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.booklist);
  const [removeImages, setRemoveImages] = useState([]); 

  const [editingBook, setEditingBook] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    author: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleAddNew = () => {
    setEditingBook(null);
    setFormData({
      id: null,
      title: "",
      author: "",
      description: "",
      images: [],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book.id);
    setFormData(book);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await dispatch(deleteBook(id)).unwrap(); // Ensure delete action completes
        alert("Book deleted successfully");
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteBook(confirmDelete)).unwrap();
        setConfirmDelete(null);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      alert("Title and Author Name cannot be empty");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("book_title", formData.title);
    formDataToSend.append("author_name", formData.author);
    formDataToSend.append("description", formData.description);

    // Append images correctly
    formData.images.forEach((image) => {
      if (image instanceof File) {
        formDataToSend.append("images", image);
      }
    });

      // Send removed images array
  // if (removeImages.length > 0) {
  //   removeImages.forEach((imageUrl) => {
  //     formDataToSend.append("removeImages[]", imageUrl); 
  //   });
  // }
  if (removeImages.length > 0) {
    formDataToSend.append("removeImages", JSON.stringify(removeImages)); // Convert to string
  }
  

    try {
      if (editingBook) {
        await dispatch(
          updateBook({ id: editingBook, updatedData: formDataToSend })
        ).unwrap();
      } else {
        await dispatch(addBook(formDataToSend)).unwrap();
      }

      setIsFormOpen(false);
      window.location.reload(); // Reload page after save/update
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const debouncedHandleChange = useCallback(
    debounce((content) => {
      setFormData((prev) => ({ ...prev, description: content }));
    }, 500),
    []
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // const handleRemoveImage = (index) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     images: prev.images.filter((_, i) => i !== index),
  //   }));
  // };

  const handleRemoveImage = (index) => {
    const imageToRemove = formData.images[index];
  
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  
    // If the image is from the backend (string URL), store it in `removeImages`
    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }
  };
  
  return (
    <Container maxWidth="xlg">
      <Box my={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">Manage Books</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNew}
          >
            Add New Book
          </Button>
        </Box>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {books.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              No books available
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
            {books.map((book) => (
              <Box key={book.id} p={2} display="flex" alignItems="center">
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.author}
                  </Typography>
                </Box>
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(book)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteConfirm(book.id)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Paper>
        )}

        <Dialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingBook ? "Edit Book" : "Add New Book"}
            <IconButton
              onClick={() => setIsFormOpen(false)}
              size="small"
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Book Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Author Name"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Description:
            </Typography>
            <JoditEditor
              value={formData.description}
              onChange={debouncedHandleChange}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Upload Images:</Typography>
              <Button
                component="label"
                variant="contained"
                startIcon={<ImageIcon />}
                sx={{ mt: 1 }}
              >
                Select Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                {formData.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{ position: "relative", width: 80, height: 80 }}
                  >
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt={"book-img-${index}"}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "rgba(255,255,255,0.8)",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default BookList;
